// type any should change once there is a unified schema for all chains - currently the schemas are defined in the schemas folder
export interface Transformer {
    transformItems(data: any[], mapFunction?: (row: any) => any): any[];
    transformStoreData(data: any[], mapFunction?: (row: any) => any): any[];
}
