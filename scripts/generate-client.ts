#!/usr/bin/env bun
/**
 * This script generates a TypeScript HTTP client from the NestJS OpenAPI schema.
 * It fetches the schema from the running backend server and generates a client
 * in the redis-queue directory for use by the consumer.
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import * as openapiTS from 'openapi-typescript';

// Use process.cwd() instead of import.meta.url
const ROOT_DIR = process.cwd();
const SCHEMA_URL = 'http://localhost:3000/api/docs-json';
const OUTPUT_DIR = join(ROOT_DIR, 'redis-queue/api-client');
const CLIENT_PATH = join(OUTPUT_DIR, 'client.ts');
const TYPES_PATH = join(ROOT_DIR, 'shared/types/api.d.ts');

// Create a basic placeholder client file if it doesn't exist yet
function ensureClientFileExists() {
    if (!existsSync(OUTPUT_DIR)) {
        mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    if (!existsSync(CLIENT_PATH)) {
        const placeholderContent = `/**
 * This file contains a TypeScript HTTP client generated from the OpenAPI schema.
 * It will be overwritten when the generate-client script is run.
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
    // Chains
    getChains: fetcher.path('/chains').method('get').create(),
    getChain: fetcher.path('/chains/{id}').method('get').create(),
    createChain: fetcher.path('/chains').method('post').create(),
    updateChain: fetcher.path('/chains/{id}').method('put').create(),
    deleteChain: fetcher.path('/chains/{id}').method('delete').create(),
    getChainStores: fetcher.path('/chains/{id}/stores').method('get').create(),
    
    // Items
    getItems: fetcher.path('/items').method('get').create(),
    searchItems: fetcher.path('/items/search').method('get').create(),
    getItem: fetcher.path('/items/{id}').method('get').create(),
};
`;
        writeFileSync(CLIENT_PATH, placeholderContent);
        console.log(`Created placeholder client file at ${CLIENT_PATH}`);
    }
}

async function generateClient() {
    try {
        console.log('Fetching OpenAPI schema from NestJS backend...');

        // Ensure the client.ts file exists
        ensureClientFileExists();

        // Check if backend is running
        try {
            const response = await fetch(SCHEMA_URL);
            if (!response.ok) {
                throw new Error(`Failed to fetch schema: ${response.statusText}`);
            }

            const schema = await response.json();

            // Generate the client
            const clientContent = `/**
 * This file contains a TypeScript HTTP client generated from the OpenAPI schema.
 * It will be overwritten when the generate-client script is run.
 * Generated on: ${new Date().toISOString()}
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
${Object.entries(schema.paths).flatMap(([path, pathItem]) => {
                return Object.entries(pathItem).map(([method, operation]) => {
                    const operationId = operation.operationId || `${method}${path.replace(/\//g, '_').replace(/[{}]/g, '')}`;
                    const methodName = operationId.split('_')[1].charAt(0).toLowerCase() + operationId.split('_')[1].slice(1);
                    return `    ${methodName}: fetcher.path('${path}').method('${method}').create(),`;
                });
            }).join('\n')}
};
`;

            // Write the generated client to file
            writeFileSync(CLIENT_PATH, clientContent);

            // Create an index.ts file to export the client
            const indexContent = `/**
 * API Client Index
 * 
 * This file exports the HTTP client generated from the OpenAPI schema.
 */

export * from './client';
`;
            writeFileSync(join(OUTPUT_DIR, 'index.ts'), indexContent);

            console.log(`✅ HTTP client successfully generated at ${CLIENT_PATH}`);
        } catch (error) {
            console.error('Error: Backend server is not running or API docs are not available.');
            console.error('Please start the backend server with: bun run backend:dev');
            console.error('Original error:', error);
            process.exit(1);
        }
    } catch (error) {
        console.error('Failed to generate HTTP client:', error);
        process.exit(1);
    }
}

// Execute the function
generateClient(); 
