import { RedisService, Message, MessageTopic } from './redis.service';

class RedisConsumer {
    private redisService: RedisService;
    private interval: NodeJS.Timer | null = null;

    constructor(redisService: RedisService) {
        this.redisService = redisService;
    }

    /**
     * Starts the consumer to read and process messages from the Redis streams
     */
    public async start(): Promise<void> {
        console.log('Starting Redis Consumer...');

        // Initialize streams if needed
        await this.redisService.initializeStreams();

        // Poll for messages
        this.interval = setInterval(async () => {
            if (this.redisService.isConnected()) {
                const messages: Message[] = await this.readMessages();
                if (messages.length > 0) {
                    console.log(`Processing ${messages.length} messages`);
                    for (const message of messages) {
                        await this.processMessage(message);
                    }
                }
            }
        }, parseInt(process.env.POLL_INTERVAL || '1000'));
    }

    /**
     * Stops the consumer
     */
    public stop(): void {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            console.log('Consumer stopped');
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
                // Use the new readStream method
                const topicMessages = await this.redisService.readStream(topic);
                messages.push(...topicMessages);
            } catch (error) {
                console.error(`Error reading from topic ${topic}:`, error);
            }
        }
        return messages;
    }

    /**
     * Processes a message
     * @param message The message to process
     */
    private async processMessage(message: Message): Promise<void> {
        console.log(`Processing message ${message.id} from topic ${message.topic}`);
        console.log('Message payload:', message.payload);
    }
}

export default RedisConsumer;

