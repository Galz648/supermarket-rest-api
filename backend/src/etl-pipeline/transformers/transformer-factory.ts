import { Injectable, Logger } from "@nestjs/common";
import { SupermarketChain } from "../data-access.service.js";
import { ShufersalTransformerService } from "./shufersal-transformer.service.js";
import { HaziHinamTransformerService } from "./hazi-hinam-transformer.service.js";
import { RamiLevyTransformerService } from "./rami-levy-transformer.service.js";
import { Transformer } from "./transformer.js";

@Injectable()
class TransformerFactory {
    private readonly logger = new Logger(TransformerFactory.name);
    private readonly transformers: Map<SupermarketChain, Transformer> = new Map();

    constructor(
        private readonly shufersalTransformer: ShufersalTransformerService,
        private readonly haziHinamTransformer: HaziHinamTransformerService,
        private readonly ramiLevyTransformer: RamiLevyTransformerService
    ) {
        try {
            this.logger.log('Initializing transformers...');
            const supportedChains = Object.values(SupermarketChain);
            this.logger.debug(`Found ${supportedChains.length} supported chains: ${supportedChains.join(', ')}`);

            for (const chain of supportedChains) {
                let transformer: Transformer | undefined;
                switch (chain) {
                    case SupermarketChain.SHUFERSAL:
                        transformer = this.shufersalTransformer;
                        break;
                    case SupermarketChain.HAZI_HINAM:
                        transformer = this.haziHinamTransformer;
                        break;
                    case SupermarketChain.RAMI_LEVY:
                        transformer = this.ramiLevyTransformer;
                        break;
                    default:
                        this.logger.warn(`No transformer implementation found for supported chain: ${chain}`);
                        continue;
                }
                if (transformer) {
                    this.transformers.set(chain, transformer);
                    this.logger.debug(`Successfully set transformer for chain: ${chain}`);
                }
            }
            this.logger.log(`Successfully initialized ${this.transformers.size} transformers`);
        } catch (error) {
            this.logger.error(`Error setting transformers: ${error}`);
        }
    }

    getTransformer(chain: SupermarketChain): Transformer {
        if (!this.transformers.has(chain)) {
            const error = new Error(`No transformer found for chain: ${chain}`);
            this.logger.error(error.message);
            throw error;
        }
        else {
            this.logger.debug(`Retrieved transformer for chain: ${chain}`);
            return this.transformers.get(chain) as Transformer;
        }
    }
}

export { TransformerFactory };
