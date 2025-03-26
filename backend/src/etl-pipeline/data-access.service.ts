import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

// API response types
export interface AvailableChains {
    list_of_chains: string[];
}

export interface ScrapedFiles {
    processed_files: Array<{ file_name: string }>;
}

export interface RawFileContent {
    row_index: string;
    found_folder: string;
    file_name: string;
    row_content: Record<string, string | number>;
}

export interface FileContent {
    rows: RawFileContent[];
}

export interface ServiceHealth {
    status: string;
    timestamp: string;
}

/**
 * Supported supermarket chains
 */
export enum SupermarketChain {
    SHUFERSAL = 'SHUFERSAL',
    // Add more chains here as needed
    // RAMI_LEVY = 'RAMI_LEVY',
    // VICTORY = 'VICTORY',
    // YOCHANANOF = 'YOCHANANOF',
}

/**
 * Available file types for extraction
 */
export enum FileType {
    PRICE_FILE = 'PRICE_FILE',
    PRICE_FULL_FILE = 'PRICE_FULL_FILE',
    PROMO_FILE = 'PROMO_FILE',
    PROMO_FULL_FILE = 'PROMO_FULL_FILE',
    STORE_FILE = 'STORE_FILE'
}
/**
 * Integrated service that handles API communication and data extraction
 * from supermarket data sources
 */

// TODO: place the endpoints in an eum
// TODO: generate the endpoints from the openapi.json file
@Injectable()
export class DataAccessService {
    private readonly logger = new Logger(DataAccessService.name);
    private readonly apiClient: AxiosInstance;
    private readonly baseUrl: string;

    constructor(private readonly configService: ConfigService) {
        // Initialize API client
        // The URL should not contain "http:@" - fixing any potential format issues
        this.baseUrl = this.configService.get<string>('SUPERMARKET_API_BASE_URL') || 'http://erlichsefi.ddns.net:8080';
        const apiToken = this.configService.get<string>('SUPERMARKET_API_TOKEN');

        this.logger.log(`Initializing API client with base URL: ${this.baseUrl}`);

        // Create authenticated API client
        this.apiClient = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': apiToken ? `Bearer ${apiToken}` : '',
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
    }

    /**
     * Check the health of the supermarket data service
     */
    async checkServiceHealth(): Promise<ServiceHealth> {
        try {
            const response = await this.apiClient.get<ServiceHealth>('/service_health');
            return response.data;
        } catch (error) {
            const errorMsg = axios.isAxiosError(error)
                ? `Service health check failed: ${error.message} (${error.code}), status: ${error.response?.status}`
                : `Service health check failed: ${error.message}`;
            this.logger.error(errorMsg);
            throw new Error(errorMsg);
        }
    }

    /**
     * Get list of available supermarket chains
     */
    async listAvailableChains(): Promise<string[]> {
        try {
            this.logger.log('Getting available chains...');
            const response = await this.apiClient.get<AvailableChains>('/list_chains');
            const chains = response.data.list_of_chains || [];
            this.logger.log(`Found ${chains.length} available chains`);
            return chains;
        } catch (error) {
            const errorMsg = axios.isAxiosError(error)
                ? `Failed to fetch chains: ${error.message} (${error.code}), status: ${error.response?.status}`
                : `Failed to fetch chains: ${error.message}`;
            this.logger.error(errorMsg);
            return [];
        }
    }

    /**
     * Get list of files for a specific chain
     * @param chain The chain identifier
     * @param fileType Optional file type filter
     */
    async listChainFileByFileType(chain: SupermarketChain, fileType: FileType): Promise<string[]> {
        try {
            this.logger.log(`Getting files for chain ${chain} and file type ${fileType}`);

            const params: Record<string, string> = { chain: chain.toString() };
            params.file_type = fileType.toString();

            const response = await this.apiClient.get<ScrapedFiles>('/list_scraped_files', {
                params
            });
            const files = response.data.processed_files.map(file => file.file_name);
            this.logger.log(`Found ${files.length} files for chain ${chain}`);
            return files;
        } catch (error) {
            const errorMsg = axios.isAxiosError(error)
                ? `Failed to fetch files for chain ${chain}: ${error.message} (${error.code}), status: ${error.response?.status}`
                : `Failed to fetch files for chain ${chain}: ${error.message}`;
            this.logger.error(errorMsg);
            return [];
        }
    }

    /**
     * Get content of a specific file
     */
    async fetchFileContent(chain: SupermarketChain, fileName: string): Promise<RawFileContent[]> {
        try {
            this.logger.log(`Fetching content for file: ${fileName} from chain: ${chain}`);
            const response = await this.apiClient.get<FileContent>('/raw/file_content', {
                params: { chain: chain.toString(), file: fileName }
            });
            this.logger.log(`Retrieved ${response.data.rows.length} rows from file ${fileName}`);
            return response.data.rows;
        } catch (error) {
            const errorMsg = axios.isAxiosError(error)
                ? `Failed to fetch file content: ${error.message} (${error.code}), status: ${error.response?.status}`
                : `Failed to fetch file content: ${error.message}`;
            this.logger.error(errorMsg);
            return [];
        }
    }

    /**
     * Get supported chains (chains we have implementations for)
     */
    getSupportedChains(): SupermarketChain[] {
        return Object.values(SupermarketChain);
    }

    /**
     * Check if a chain is supported
     */
    isChainSupported(chainId: string): boolean {
        return Object.values(SupermarketChain).includes(chainId as SupermarketChain);
    }

    /**
     * Extract files matching a specific pattern
     */



    private async extractFilesByPattern(chain: SupermarketChain, fileType: FileType): Promise<RawFileContent[]> {

        const files = await this.listChainFileByFileType(chain, fileType);
        const rows = await Promise.all(files.map(file => this.fetchFileContent(chain, file)));
        return rows.flat();
    }
    /**
     * Extract store data for a specific chain
     */
    async extractStoreData(chain: SupermarketChain): Promise<RawFileContent[]> {
        this.logger.log(`Extracting store data for chain ${chain}...`);
        return this.extractFilesByPattern(chain, FileType.STORE_FILE);
    }
} 
