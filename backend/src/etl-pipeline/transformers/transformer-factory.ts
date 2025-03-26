import { Injectable } from "@nestjs/common";
import { SupermarketChain } from "../data-access.service.js";
import { ShufersalTransformerService } from "./shufersal-transformer.service.js";
import { Transformer } from "./transformer.js";
@Injectable()
class TransformerFactory {
    private readonly transformers: Map<SupermarketChain, Transformer> = new Map();

    constructor(private readonly shufersalTransformer: ShufersalTransformerService) {
        this.transformers.set(SupermarketChain.SHUFERSAL, shufersalTransformer);
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
