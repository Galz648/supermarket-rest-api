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
    private connectionCheckInterval: ReturnType<typeof setInterval> | null = null;

    /**
     * Creates a new Redis producer
     * @param redisService The Redis service to use
     */
    constructor(redisService: RedisService) {
        this.redisService = redisService;

        // Add periodic connection status check
        this.connectionCheckInterval = setInterval(() => {
            console.log(`[Producer] Redis connection status: ${this.redisService.isConnected() ? 'CONNECTED' : 'DISCONNECTED'}`);
        }, 1000);
    }

    public start(): void {
        if (this.subscription) {
            console.log('[Producer] Already running');
            return;
        }

        console.log('[Producer] Starting Redis Producer...');
        console.log('[Producer] Sending "Hello World" messages every 5 seconds');
        console.log(`[Producer] Current Redis connection status: ${this.redisService.isConnected() ? 'CONNECTED' : 'DISCONNECTED'}`);

        // Send a message every second using RxJS
        this.subscription = interval(5000).pipe(
            filter(() => {
                const isConnected = this.redisService.isConnected();
                if (!isConnected) {
                    console.log('[Producer] Skipping message send - Redis not connected');
                }
                return isConnected;
            }),
            tap(() => {
                this.messageCount++;
                const topic = MessageTopic.PRODUCT_UPDATES;

                const message = {
                    message: `Hello World #${this.messageCount}`,
                    timestamp: new Date().toISOString()
                };

                console.log(`[Producer] Attempting to send message #${this.messageCount} to topic ${topic}`);

                this.redisService.publishMessage(topic, message)
                    .then(messageId => {
                        if (messageId) {
                            console.log(`[Producer] Sent message #${this.messageCount} to topic ${topic} with ID ${messageId}`);
                        } else {
                            console.error(`[Producer] Failed to send message #${this.messageCount} to topic ${topic}`);
                        }
                    })
                    .catch(error => {
                        console.error('[Producer] Error sending message:', error);
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
            console.log('[Producer] Stopped');
        }

        if (this.connectionCheckInterval) {
            clearInterval(this.connectionCheckInterval);
            this.connectionCheckInterval = null;
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
            console.warn('[Producer] Cannot publish message: Redis not connected');
            return null;
        }

        try {
            console.log(`[Producer] Publishing message to topic ${topic}`);
            const messageId = await this.redisService.publishMessage(topic, payload);
            if (messageId) {
                console.log(`[Producer] Published message to topic ${topic} with ID ${messageId}`);
            } else {
                console.error(`[Producer] Failed to publish message to topic ${topic} - no message ID returned`);
            }
            return messageId;
        } catch (error) {
            console.error(`[Producer] Error publishing message to topic ${topic}:`, error);
            return null;
        }
    }
}

export default RedisProducer; 
