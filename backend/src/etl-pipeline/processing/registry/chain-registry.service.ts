import { Injectable, Logger } from '@nestjs/common';
import { SupermarketChain } from '../../data-access.service.js';
import { Transformer } from '../transformers/transformer.js';
import { Normalizer } from '../normalization/store-normalizer.interface.js';
import { ShufersalTransformerService } from '../transformers/shufersal-transformer.service.js';
import { HaziHinamTransformerService } from '../transformers/hazi-hinam-transformer.service.js';
import { UniformItem, UniformStore } from '../../schemas/uniform/index.js';
// Import other transformers and normalizers as needed

/**
 * Registry structure for a supermarket chain
 */
interface ChainRegistryEntry {
    transformer?: Transformer;
    normalizer?: Normalizer<UniformItem | UniformStore>;
}

/**
 * Central registry for all chain-specific components
 * Maps each chain to its transformer and optional normalizers
 */
@Injectable()
export class ChainRegistryService {
    private readonly logger = new Logger(ChainRegistryService.name);
    private readonly registry = new Map<SupermarketChain, ChainRegistryEntry>();

    constructor(
        private readonly shufersalTransformer: ShufersalTransformerService,
        private readonly haziHinamTransformer: HaziHinamTransformerService,
    ) {
        this.initializeRegistry();
    }

    /**
     * Register a transformer for a specific chain
     * @param chain The supermarket chain
     * @param transformer The transformer to register
     */
    registerTransformer(chain: SupermarketChain, transformer: Transformer): void {
        if (!this.registry.has(chain)) {
            this.registry.set(chain, { transformer });
        } else {
            this.registry.get(chain)!.transformer = transformer;
        }
        this.logger.debug(`Registered transformer for chain: ${chain}`);
    }

    /**
     * Register a normalizer for a specific chain
     * @param chain The supermarket chain
     * @param normalizer The normalizer to register
     */
    registerNormalizer(chain: SupermarketChain, normalizer: Normalizer<UniformItem | UniformStore>): void {
        if (!this.registry.has(chain)) {
            this.registry.set(chain, { normalizer });
        } else {
            this.registry.get(chain)!.normalizer = normalizer;
        }
        this.logger.debug(`Registered normalizer for chain: ${chain}`);
    }

    /**
     * Initialize the registry with all supported chains
     */
    private initializeRegistry(): void {
        this.logger.log('Initializing chain registry...');

        // Register Shufersal components
        this.registerTransformer(SupermarketChain.SHUFERSAL, this.shufersalTransformer);

        // Register Hazi Hinam components
        this.registerTransformer(SupermarketChain.HAZI_HINAM, this.haziHinamTransformer);

        // Register other transformers and normalizers as needed

        this.logger.log(`Successfully initialized registry with ${this.registry.size} chains`);
    }

    /**
     * Get the transformer for a specific chain
     * @param chain The supermarket chain
     * @returns The transformer for the chain
     */
    getTransformer(chain: SupermarketChain): Transformer {
        const entry = this.registry.get(chain);
        if (!entry || !entry.transformer) {
            throw new Error(`No transformer found for chain: ${chain}`);
        }
        return entry.transformer;
    }

    /**
     * Get the normalizer for a specific chain if available
     * @param chain The supermarket chain
     * @returns The normalizer for the chain or undefined if not available
     */
    getStoreNormalizer(chain: SupermarketChain): Normalizer<UniformItem | UniformStore> | undefined {
        const entry = this.registry.get(chain);
        if (!entry) {
            throw new Error(`No registry entry found for chain: ${chain}`);
        }
        return entry.normalizer;
    }

    /**
     * Check if a chain has a store normalizer
     * @param chain The supermarket chain
     * @returns Whether the chain has a normalizer
     */
    hasStoreNormalizer(chain: SupermarketChain): boolean {
        const entry = this.registry.get(chain);
        return !!entry && !!entry.normalizer;
    }

    /**
     * Get all registered chains
     * @returns Array of registered chain enums
     */
    getRegisteredChains(): SupermarketChain[] {
        return Array.from(this.registry.keys());
    }
} 
