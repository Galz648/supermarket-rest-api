import { RedisService, MessageTopic } from './redis.service';
import { interval, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

/**
 * Redis Producer class for sending messages to Redis streams
 */
class RedisProducer {
    private redisService: RedisService;
    private subscription: Subscription | null = null;
    private messageCount = 0;

    /**
     * Creates a new Redis producer
     * @param redisService The Redis service to use
     */
    constructor(redisService: RedisService) {
        this.redisService = redisService;
    }

    /**
     * Starts sending "Hello World" messages to Redis every second
     */
    public start(): void {
        if (this.subscription) {
            console.log('Producer already running');
            return;
        }

        console.log('Starting Redis Producer...');
        console.log('Sending "Hello World" messages every second');

        // Send a message every second using RxJS
        this.subscription = interval(1000).pipe(
            filter(() => this.redisService.isConnected()),
            tap(() => {
                this.messageCount++;
                const topic = MessageTopic.PRODUCT_UPDATES;

                const message = {
                    message: `Hello World #${this.messageCount}`,
                    timestamp: new Date().toISOString()
                };

                this.redisService.publishMessage(topic, message)
                    .then(messageId => {
                        if (messageId) {
                            console.log(`Sent message #${this.messageCount} to topic ${topic} with ID ${messageId}`);
                        } else {
                            console.error(`Failed to send message #${this.messageCount} to topic ${topic}`);
                        }
                    })
                    .catch(error => {
                        console.error('Error sending message:', error);
                    });
            })
        ).subscribe();
    }

    /**
     * Stops the producer
     */
    public stop(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
            console.log('Producer stopped');
        }
    }

    /**
     * Publishes a message to a specific topic
     * @param topic The topic to publish to
     * @param payload The message payload
     * @returns The ID of the published message or null if failed
     */
    public async publishMessage(topic: string, payload: Record<string, any>): Promise<string | null> {
        if (!this.redisService.isConnected()) {
            console.warn('Cannot publish message: Redis not connected');
            return null;
        }

        try {
            const messageId = await this.redisService.publishMessage(topic, payload);
            if (messageId) {
                console.log(`Published message to topic ${topic} with ID ${messageId}`);
            }
            return messageId;
        } catch (error) {
            console.error(`Error publishing message to topic ${topic}:`, error);
            return null;
        }
    }
}

export default RedisProducer; 
