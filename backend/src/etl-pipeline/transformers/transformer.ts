// type any should change once there is a unified schema for all chains - currently the schemas are defined in the schemas folder

import { RawFileContent } from "../data-access.service.js";
import { ShufersalItem, ShufersalStore } from "../schemas/shufersal-schema.js";

type TransformedStoreData = ShufersalStore;
type TransformedItemData = ShufersalItem;

export interface Transformer {
    transformItems(data: RawFileContent[], mapFunction?: (row: RawFileContent) => TransformedItemData): TransformedItemData[];
    transformStoreData(data: RawFileContent[], mapFunction?: (row: RawFileContent) => TransformedStoreData): TransformedStoreData[];
}
