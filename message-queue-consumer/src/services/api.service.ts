import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { Observable, from, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import config from '../config';

export class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: config.api.endpoint,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Send data to a specific API endpoint
     */
    public sendToEndpoint(endpoint: string, data: any): Observable<any> {
        return from(this.client.post(endpoint, data)).pipe(
            map(response => response.data),
            catchError(error => {
                console.error(`Error sending data to ${endpoint}:`, error.message);
                return throwError(() => new Error(`Failed to send data to ${endpoint}: ${error.message}`));
            })
        );
    }

    /**
     * Update a resource at a specific API endpoint
     */
    public updateResource(endpoint: string, id: string, data: any): Observable<any> {
        return from(this.client.put(`${endpoint}/${id}`, data)).pipe(
            map(response => response.data),
            catchError(error => {
                console.error(`Error updating resource at ${endpoint}/${id}:`, error.message);
                return throwError(() => new Error(`Failed to update resource at ${endpoint}/${id}: ${error.message}`));
            })
        );
    }

    /**
     * Delete a resource at a specific API endpoint
     */
    public deleteResource(endpoint: string, id: string): Observable<any> {
        return from(this.client.delete(`${endpoint}/${id}`)).pipe(
            map(response => response.data),
            catchError(error => {
                console.error(`Error deleting resource at ${endpoint}/${id}:`, error.message);
                return throwError(() => new Error(`Failed to delete resource at ${endpoint}/${id}: ${error.message}`));
            })
        );
    }
} 
