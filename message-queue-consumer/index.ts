import { RedisService } from './src/services/redis.service';
import { MessageProcessorService, MessageTopic } from './src/services/message-processor.service';
import { mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

console.log('Starting Redis Message Queue Consumer...');
console.log(`Available topics: ${Object.values(MessageTopic).join(', ')}`);

// Create services
const redisService = new RedisService();
const messageProcessor = new MessageProcessorService();

// Process shutdown gracefully
const handleShutdown = () => {
    console.log('Shutting down...');
    redisService.disconnect();
    process.exit(0);
};

// Handle process termination
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

// Start polling for messages
const subscription = redisService.startPolling().subscribe({
    error: (err) => console.error('Error in polling:', err),
    complete: () => console.log('Polling completed'),
});

// Subscribe to messages and process them
const messageSubscription = redisService.getMessages().pipe(
    mergeMap(message => messageProcessor.processMessage(message).pipe(
        catchError(error => {
            console.error(`Error processing message ${message.id}:`, error);
            return of({ status: 'error', error: error.message });
        })
    ))
).subscribe({
    next: result => console.log('Message processed:', result),
    error: err => console.error('Error in message processing stream:', err),
    complete: () => console.log('Message processing completed'),
});

console.log('Consumer is running and waiting for messages...');
