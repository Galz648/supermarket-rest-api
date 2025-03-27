import { Injectable } from "@nestjs/common";
import { SupermarketChain } from "../data-access.service.js";
import { ShufersalTransformerService } from "./shufersal-transformer.service.js";
import { HaziHinamTransformerService } from "./hazi-hinam-transformer.service.js";
import { Transformer } from "./transformer.js";

@Injectable()
class TransformerFactory {
    private readonly transformers: Map<SupermarketChain, Transformer> = new Map();

    constructor(
        private readonly shufersalTransformer: ShufersalTransformerService,
        private readonly haziHinamTransformer: HaziHinamTransformerService
    ) {
        try {

            this.transformers.set(SupermarketChain.SHUFERSAL, shufersalTransformer);
            this.transformers.set(SupermarketChain.HAZI_HINAM, haziHinamTransformer);
        } catch (error) {
            console.error(`Error setting transformers: ${error}`);
        }
    }

    getTransformer(chain: SupermarketChain): Transformer {
        if (!this.transformers.has(chain)) {
            throw new Error(`No transformer found for chain: ${chain}`);
        }
        else {
            return this.transformers.get(chain) as Transformer;
        }
    }
}

export { TransformerFactory };
