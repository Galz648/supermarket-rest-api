import Redis from 'ioredis';

/**
 * Message interface for Redis streams
 */
export interface Message {
    id: string;
    topic: string;
    payload: Record<string, any>;
    timestamp: number;
}

/**
 * Enum for message topics
 */
export enum MessageTopic {
    PRODUCT_UPDATES = 'product-updates',
    PRICE_CHANGES = 'price-changes',
    INVENTORY_UPDATES = 'inventory-updates',
    SUPERMARKET_ETL = 'supermarket-etl'
}

/**
 * Redis service for interacting with Redis streams
 */
export class RedisService {
    private client: Redis;
    private connected = false;

    // Track the last read ID for each topic
    private lastReadIds: Record<string, string> = {};

    /**
     * Creates a new Redis service
     * @param host Redis host
     * @param port Redis port
     */
    constructor(host: string = 'localhost', port: number = 6379) {
        this.client = new Redis({
            host,
            port,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                console.log(`Retrying connection to Redis (attempt ${times}) in ${delay}ms...`);
                return delay;
            }
        });

        this.client.on('connect', () => {
            console.log('Connected to Redis');
            this.connected = true;
        });

        this.client.on('error', (err) => {
            console.error('Redis connection error:', err);
            this.connected = false;
        });

        this.client.on('close', () => {
            console.log('Redis connection closed');
            this.connected = false;
        });
    }

    /**
     * Checks if the client is connected to Redis
     * @returns True if connected, false otherwise
     */
    public isConnected(): boolean {
        return this.connected;
    }

    /**
     * Disconnects from Redis
     */
    public disconnect(): void {
        this.client.disconnect();
    }

    /**
     * Initializes Redis streams for all topics
     */
    public async initializeStreams(consumerGroup: string = 'supermarket-etl'): Promise<void> {
        for (const topic of Object.values(MessageTopic)) {
            try {
                // Create the consumer group if it doesn't exist
                await this.client.xgroup('CREATE', topic, consumerGroup, '$', 'MKSTREAM')
                    .catch((err) => {
                        // Ignore BUSYGROUP error (group already exists)
                        if (!err.message.includes('BUSYGROUP')) {
                            throw err;
                        }
                    });

                console.log(`Initialized stream for topic: ${topic}`);
            } catch (error) {
                console.error(`Error initializing stream for topic ${topic}:`, error);
                // Continue with other topics even if one fails
            }
        }
    }

    /**
     * Publishes a message to a Redis stream
     * @param topic The topic to publish to
     * @param payload The message payload
     * @returns The ID of the published message or null if failed
     */
    public async publishMessage(topic: string, payload: any): Promise<string | null> {
        if (!this.isConnected()) {
            console.warn('Cannot publish message: Redis not connected');
            return null;
        }

        try {
            const timestamp = Date.now();
            const messageData = {
                ...payload,
                timestamp: timestamp.toString()
            };

            // Convert payload to Redis stream format (field-value pairs)
            const entries: Record<string, string> = {};
            for (const [key, value] of Object.entries(messageData)) {
                entries[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
            }

            // Publish message to stream
            const messageId = await this.client.xadd(topic, '*', ...Object.entries(entries).flat());
            return messageId;
        } catch (error) {
            console.error(`Error publishing message to topic ${topic}:`, error);
            return null;
        }
    }

    /**
     * Reads messages from a Redis stream
     * @param topic The topic to read from
     * @param consumerGroup The consumer group name
     * @param consumerName The consumer name
     * @param count Maximum number of messages to read
     * @returns Array of messages
     */
    public async readMessages(
        topic: string,
        consumerGroup: string = 'supermarket-etl',
        consumerName: string = 'consumer-1',
        count: number = 10
    ): Promise<Message[]> {
        if (!this.isConnected()) {
            console.warn('Cannot read messages: Redis not connected');
            return [];
        }

        try {
            // Read messages from stream that haven't been acknowledged
            const streams = await this.client.xreadgroup(
                'GROUP', consumerGroup, consumerName,
                'COUNT', count,
                'STREAMS', topic, '>'
            );

            if (!streams || streams.length === 0) {
                return [];
            }

            // Parse messages
            const messages: Message[] = [];
            // Cast to the correct type to fix TypeScript error
            const typedStreams = streams as unknown as [string, [string, string[]][]][];

            for (const [streamName, streamMessages] of typedStreams) {
                for (const [messageId, messageFields] of streamMessages) {
                    // Convert Redis message format to object
                    const payload: Record<string, any> = {};
                    for (let i = 0; i < messageFields.length; i += 2) {
                        const key = messageFields[i];
                        const value = messageFields[i + 1];

                        // Try to parse JSON values
                        if (value && typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                            try {
                                payload[key] = JSON.parse(value);
                            } catch {
                                payload[key] = value;
                            }
                        } else {
                            payload[key] = value;
                        }
                    }

                    // Extract timestamp or use current time
                    const timestamp = payload.timestamp ? parseInt(payload.timestamp as string) : Date.now();
                    delete payload.timestamp;

                    messages.push({
                        id: messageId,
                        topic: streamName,
                        payload,
                        timestamp
                    });
                }
            }

            return messages;
        } catch (error) {
            console.error(`Error reading messages from topic ${topic}:`, error);
            return [];
        }
    }

    /**
     * Acknowledges a message as processed
     * @param topic The topic the message belongs to
     * @param consumerGroup The consumer group name
     * @param messageId The ID of the message to acknowledge
     */
    public async acknowledgeMessage(
        topic: string,
        consumerGroup: string,
        messageId: string
    ): Promise<void> {
        try {
            await this.client.xack(topic, consumerGroup, messageId);
        } catch (error) {
            console.error(`Error acknowledging message ${messageId} from topic ${topic}:`, error);
        }
    }

    /**
     * Reads messages from a Redis stream without using consumer groups
     * @param topic The topic to read from
     * @param count Maximum number of messages to read
     * @returns Array of messages
     */
    public async readStream(topic: string, count: number = 10): Promise<Message[]> {
        if (!this.isConnected()) {
            console.warn('Cannot read stream: Redis not connected');
            return [];
        }

        try {
            // Use the last read ID or '$' for only new messages
            const lastId = this.lastReadIds[topic] || '$';

            // Read messages from stream
            const streams = await this.client.xread(
                'COUNT', count,
                'BLOCK', 100,  // Block for 100ms
                'STREAMS', topic, lastId
            );

            if (!streams || streams.length === 0) {
                return [];
            }

            // Parse messages
            const messages: Message[] = [];
            // Cast to the correct type to fix TypeScript error
            const typedStreams = streams as unknown as [string, [string, string[]][]][];

            for (const [streamName, streamMessages] of typedStreams) {
                if (streamMessages.length > 0) {
                    // Update the last read ID for this topic
                    const lastMessage = streamMessages[streamMessages.length - 1];
                    this.lastReadIds[topic] = lastMessage[0]; // Message ID

                    for (const [messageId, messageFields] of streamMessages) {
                        // Convert Redis message format to object
                        const payload: Record<string, any> = {};
                        for (let i = 0; i < messageFields.length; i += 2) {
                            const key = messageFields[i];
                            const value = messageFields[i + 1];

                            // Try to parse JSON values
                            if (value && typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                                try {
                                    payload[key] = JSON.parse(value);
                                } catch {
                                    payload[key] = value;
                                }
                            } else {
                                payload[key] = value;
                            }
                        }

                        messages.push({
                            id: messageId,
                            topic: streamName,
                            payload,
                            timestamp: Date.now()
                        });
                    }
                }
            }

            return messages;
        } catch (error) {
            console.error(`Error reading messages from topic ${topic}:`, error);
            return [];
        }
    }
} 
