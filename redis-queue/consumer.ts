import { RedisService, Message, MessageTopic } from './redis.service';
// Import the client directly from the file to avoid module resolution issues
import { api, fetcher } from './api-client/client';

class RedisConsumer {
    private redisService: RedisService;
    private interval: ReturnType<typeof setInterval> | null = null;
    private apiConnectionStatus = false;
    private apiErrorCount = 0;
    private maxApiErrors = 3; // Number of consecutive errors before backing off
    private messageProcessCount = 0;

    constructor(redisService: RedisService) {
        this.redisService = redisService;
        console.log('[Consumer] Consumer instance created');
    }

    /**
     * Starts the consumer to read and process messages from the Redis streams
     */
    public async start(): Promise<void> {
        console.log('[Consumer] Starting Redis Consumer...');

        // Initialize streams if needed
        try {
            await this.redisService.initializeStreams();
            console.log('[Consumer] Streams initialized successfully');
        } catch (error) {
            console.error('[Consumer] Error initializing streams:', error);
        }

        // Check API connection
        this.checkApiConnection();

        // Set up periodic API connection check - less frequent to avoid flooding logs
        setInterval(() => this.checkApiConnection(), 30000);

        // Poll for messages
        const pollInterval = parseInt(process.env.POLL_INTERVAL || '1000');
        console.log(`[Consumer] Setting up message polling every ${pollInterval}ms`);

        this.interval = setInterval(async () => {
            if (this.redisService.isConnected()) {
                try {
                    console.log('[Consumer] Polling for messages...');
                    const messages: Message[] = await this.readMessages();
                    if (messages.length > 0) {
                        console.log(`[Consumer] Processing ${messages.length} messages`);
                        for (const message of messages) {
                            try {
                                this.messageProcessCount++;
                                console.log(`[Consumer] Processing message #${this.messageProcessCount}: ${message.id} from topic ${message.topic}`);

                                // Process message and acknowledge it regardless of API status
                                await this.processMessage(message);

                                // Acknowledge the message as processed
                                await this.redisService.acknowledgeMessage(
                                    message.topic,
                                    'supermarket-etl',
                                    message.id
                                );
                                console.log(`[Consumer] Acknowledged message ${message.id}`);
                            } catch (error) {
                                console.error(`[Consumer] Error processing message ${message.id}:`, error);
                                // Still acknowledge the message to avoid reprocessing
                                await this.redisService.acknowledgeMessage(
                                    message.topic,
                                    'supermarket-etl',
                                    message.id
                                );
                            }
                        }
                    } else {
                        console.log('[Consumer] No messages to process');
                    }
                } catch (error) {
                    console.error('[Consumer] Error processing messages:', error);
                }
            } else {
                console.log('[Consumer] Redis not connected, skipping message poll');
            }
        }, pollInterval);

        console.log('[Consumer] Consumer started successfully');
    }

    /**
     * Checks the API connection status
     */
    private async checkApiConnection(): Promise<void> {
        try {
            console.log('[Consumer] Checking API connection...');
            const getItems = fetcher.path('/items').method('get').create();
            const response = await getItems({});

            console.log(`[Consumer] API connection successful, received ${Array.isArray(response.data) ? response.data.length : 0} items`);

            // Reset error count on successful connection
            this.apiErrorCount = 0;

            if (!this.apiConnectionStatus) {
                console.log('[Consumer] API connection established');
                this.apiConnectionStatus = true;
            }
        } catch (error: any) {
            this.apiErrorCount++;

            if (this.apiConnectionStatus) {
                console.error('[Consumer] API connection lost:', error.message || 'Unknown error');
                this.apiConnectionStatus = false;
            } else if (this.apiErrorCount <= this.maxApiErrors) {
                // Only log detailed errors for the first few attempts to avoid flooding logs
                console.error('[Consumer] API connection check failed:', error.message || 'Unknown error');
            } else if (this.apiErrorCount % 10 === 0) {
                // Log less frequently after max errors
                console.error(`[Consumer] API still unavailable after ${this.apiErrorCount} attempts`);
            }
        }
    }

    /**
     * Stops the consumer
     */
    public stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            console.log('[Consumer] Consumer stopped');
        }
    }

    /**
     * Reads messages from all topics
     * @returns Array of messages
     */
    private async readMessages(): Promise<Message[]> {
        const messages: Message[] = [];
        for (const topic of Object.values(MessageTopic)) {
            try {
                console.log(`[Consumer] Reading messages from topic ${topic}...`);
                // Use the new readStream method
                const topicMessages = await this.redisService.readStream(topic);
                if (topicMessages.length > 0) {
                    console.log(`[Consumer] Read ${topicMessages.length} messages from topic ${topic}`);
                    messages.push(...topicMessages);
                } else {
                    console.log(`[Consumer] No messages in topic ${topic}`);
                }
            } catch (error) {
                console.error(`[Consumer] Error reading from topic ${topic}:`, error);
            }
        }
        return messages;
    }

    /**
     * Processes a message
     * @param message The message to process
     */
    private async processMessage(message: Message): Promise<void> {
        console.log(`[Consumer] Processing message ${message.id} from topic ${message.topic}`);
        console.log('[Consumer] Message payload:', message.payload);

        // Always try to interact with API, but don't fail if API is unavailable
        try {
            await this.interactWithAPI(message);
        } catch (error) {
            console.error('[Consumer] Error interacting with API, but continuing message processing:', error);
            // Don't rethrow - we want to continue processing even if API fails
        }
    }

    /**
     * Interacts with the API using the generated HTTP client
     * @param message The message to process
     */
    private async interactWithAPI(message: Message): Promise<void> {
        if (!this.apiConnectionStatus) {
            console.warn('[Consumer] Skipping API interaction - API not connected');
            return;
        }

        try {
            console.log('[Consumer] Interacting with API...');
            // Create API operations directly using fetcher
            const createItem = api.create;
            const createItemResponse = await createItem({
                name: 'Test Item',
                category: 'Test Category',
                brand: 'Test Brand',
                unit: 'Test Unit'
            });
            console.log('[Consumer] Test item created successfully:', createItemResponse.data);
            // const getItems = fetcher.path('/items').method('get').create();
            // const getChains = fetcher.path('/chains').method('get').create();

            // // Test with dummy data regardless of the message topic
            // try {
            //     // Try to get items - using empty object for query to avoid type issues
            //     const itemsResponse = await getItems({});
            //     console.log(`[Consumer] Successfully fetched items from API:`,
            //         Array.isArray(itemsResponse.data) ? itemsResponse.data.length : 'Response is not an array');
            // } catch (apiError: any) {
            //     // Don't set apiConnectionStatus to false on every error
            //     // This allows us to keep trying even if one endpoint fails
            //     console.log('[Consumer] Could not fetch items, API endpoint might not be available:', apiError.message);
            // }

            // try {
            //     // Try to get chains
            //     const chainsResponse = await getChains({});
            //     console.log(`[Consumer] Successfully fetched chains from API:`,
            //         Array.isArray(chainsResponse.data) ? chainsResponse.data.length : 'Response is not an array');
            // } catch (apiError: any) {
            //     console.log('[Consumer] Could not fetch chains, API endpoint might not be available:', apiError.message);
            // }

            /* 
            // Original topic-based code commented out
            switch (message.topic) {
                case MessageTopic.PRODUCT_UPDATES:
                    // If the message is about an item, fetch it from the API
                    if (message.payload.itemId) {
                        const response = await api.getItem({ path: { id: message.payload.itemId } });
                        console.log('Item fetched from API:', response.data);
                    } else {
                        // Get all items with pagination
                        const response = await api.getItems({ query: { page: 1, limit: 10 } });
                        console.log(`Fetched ${response.data.length} items from API`);
                    }
                    break;

                case MessageTopic.PRICE_CHANGES:
                    // If the message is about a chain, fetch it from the API
                    if (message.payload.chainId) {
                        const response = await api.getChain({ path: { id: message.payload.chainId } });
                        console.log('Chain fetched from API:', response.data);

                        // Get stores for this chain
                        const storesResponse = await api.getChainStores({ path: { id: message.payload.chainId } });
                        console.log(`Fetched ${storesResponse.data.length} stores for chain`);
                    } else {
                        // Get all chains
                        const response = await api.getChains({});
                        console.log(`Fetched ${response.data.length} chains from API`);
                    }
                    break;

                default:
                    console.log(`No API interaction defined for topic ${message.topic}`);
            }
            */
        } catch (error: any) {
            console.error('[Consumer] Error interacting with API:', error.message);
            // Don't set apiConnectionStatus to false here
            // We'll let the periodic check handle that
        }
    }
}

export default RedisConsumer;

