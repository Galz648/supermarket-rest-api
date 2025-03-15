/**
 * Shared API Types
 * 
 * This file re-exports the types generated from the NestJS OpenAPI schema.
 * It provides convenient access to the API types for both the backend and message queue consumer.
 */

// Export all types from the generated API schema
export * from './api.d';

// Import and re-export the paths and operations namespaces
import type { paths, operations } from './api.d';
export { paths, operations };

// Define placeholder types until the OpenAPI schema is properly generated
// These will be replaced by the generated types when available

/**
 * API Response types
 * These types represent the structure of API responses
 */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}
/**
 * API Request types
 * These types represent common request parameters
 */
export interface PaginationParams {
    page?: number;
    limit?: number;
}

export interface SearchParams extends PaginationParams {
    q: string;
}
