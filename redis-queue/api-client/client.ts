/**
 * This file contains a TypeScript HTTP client generated from the OpenAPI schema.
 * It will be overwritten when the generate-client script is run.
 * Generated on: 2025-03-15T16:28:04.431Z
 */

import { Fetcher } from 'openapi-typescript-fetch';
import type { paths } from '../../shared/types/api.d';

// Create a fetcher instance
export const fetcher = Fetcher.for<paths>();

// Configure the fetcher
fetcher.configure({
    baseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
    init: {
        headers: {
            'Content-Type': 'application/json',
        },
    },
});

// Export operations
export const api = {
    getInfo: fetcher.path('/').method('get').create(),
    update: fetcher.path('/chains/{id}').method('put').create(),
    remove: fetcher.path('/chains/{id}').method('delete').create(),
    findStores: fetcher.path('/chains/{id}/stores').method('get').create(),
    findAll: fetcher.path('/items').method('get').create(),
    create: fetcher.path('/items').method('post').create(),
    search: fetcher.path('/items/search').method('get').create(),
    findOne: fetcher.path('/items/{id}').method('get').create(),
};
