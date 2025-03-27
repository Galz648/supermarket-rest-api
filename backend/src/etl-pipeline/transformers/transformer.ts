// type any should change once there is a unified schema for all chains - currently the schemas are defined in the schemas folder

import { RawFileContent } from "../data-access.service.js";
import { UniformStore } from "../schemas/store-uniform-schema.js";
import { UniformItem } from "../schemas/item-uniform-schema.js";
type TransformedStoreData = UniformStore;
type TransformedProductData = UniformItem;

export interface Transformer {
    transformProductData(productData: RawFileContent[]): TransformedProductData[];
    transformStoreData(storeData: RawFileContent[]): TransformedStoreData[];
}
