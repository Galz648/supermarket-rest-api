// type any should change once there is a unified schema for all chains - currently the schemas are defined in the schemas folder

import { RawFileContent } from "../data-access.service.js";
import { UniformStore } from "../schemas/uniform/index.js";
import { UniformItem } from "../schemas/uniform/index.js";
type TransformedStoreData = UniformStore;
type TransformedProductData = UniformItem;

export interface Transformer {
    transformProductData(productData: RawFileContent[]): TransformedProductData[];
    transformStoreData(storeData: RawFileContent[]): TransformedStoreData[];
}
