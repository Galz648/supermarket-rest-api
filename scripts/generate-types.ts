#!/usr/bin/env bun
/**
 * This script generates TypeScript types from the NestJS OpenAPI schema.
 * It fetches the schema from the running backend server and generates types
 * in the shared/types directory for use by both the backend and message consumer.
 */

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as openapiTS from 'openapi-typescript';

// Use process.cwd() instead of import.meta.url
const ROOT_DIR = process.cwd();
const SCHEMA_URL = 'http://localhost:3000/api/docs-json';
const OUTPUT_PATH = join(ROOT_DIR, 'shared/types/api.d.ts');

// Create a basic placeholder file if it doesn't exist yet
function ensureApiTypesFileExists() {
    if (!existsSync(OUTPUT_PATH)) {
        const placeholderContent = `/**
 * This file contains TypeScript definitions generated from the OpenAPI schema.
 * It will be overwritten when the generate-types script is run.
 */

export namespace components {
  export namespace schemas {
    export interface Item {
      id?: string;
      name?: string;
      [key: string]: any;
    }
    
    export interface Chain {
      id?: string;
      name?: string;
      [key: string]: any;
    }
  }
}

export namespace paths {}
`;
        writeFileSync(OUTPUT_PATH, placeholderContent);
        console.log(`Created placeholder types file at ${OUTPUT_PATH}`);
    }
}

async function generateTypes() {
    try {
        console.log('Fetching OpenAPI schema from NestJS backend...');

        // Ensure the api.d.ts file exists
        ensureApiTypesFileExists();

        // Check if backend is running
        try {
            const response = await fetch(SCHEMA_URL);
            if (!response.ok) {
                throw new Error(`Failed to fetch schema: ${response.statusText}`);
            }

            const schema = await response.json();

            // Generate TypeScript definitions from OpenAPI schema
            const output = await openapiTS.default(schema);

            // Write the generated types to file
            writeFileSync(OUTPUT_PATH, output);

            console.log(`✅ Types successfully generated at ${OUTPUT_PATH}`);
        } catch (error) {
            console.error('Error: Backend server is not running or API docs are not available.');
            console.error('Please start the backend server with: bun run backend:dev');
            console.error('Original error:', error);
            process.exit(1);
        }
    } catch (error) {
        console.error('Failed to generate types:', error);
        process.exit(1);
    }
}

// Execute the function
generateTypes(); 
