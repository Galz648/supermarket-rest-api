import { z } from 'zod';

// Helper function to handle both string and number values
const stringOrNumber = z.union([z.string(), z.number().transform(n => String(n))]);

// Item schema for Tiv Taam product data
export const TivTaamProductSchema = z.object({
    row_index: stringOrNumber,
    found_folder: z.string(),
    file_name: z.string(),
    row_content: z.object({
        chainid: stringOrNumber,
        subchainid: stringOrNumber,
        storeid: stringOrNumber,
        bikoretno: stringOrNumber,
        priceupdatedate: z.string(),
        itemcode: stringOrNumber,
        itemtype: stringOrNumber,
        itemname: z.string(),
        manufacturername: z.string(),
        manufacturecountry: z.string(),
        manufactureritemdescription: z.string(),
        unitqty: z.string(),
        quantity: stringOrNumber,
        bisweighted: stringOrNumber,
        unitofmeasure: z.string(),
        qtyinpackage: stringOrNumber,
        itemprice: stringOrNumber,
        unitofmeasureprice: stringOrNumber,
        allowdiscount: stringOrNumber,
        itemstatus: stringOrNumber
    }),
});

export type TivTaamProduct = z.infer<typeof TivTaamProductSchema>;

// Store schema for Tiv Taam store data
export const TivTaamStoreSchema = z.object({
    row_content: z.object({
        chainid: stringOrNumber,
        subchainid: stringOrNumber,
        storeid: stringOrNumber,
        bikoretno: stringOrNumber,
        storename: z.string(),
        address: z.string(),
        city: z.string(),
        zipcode: z.string(),
        lastupdate: z.string().optional(),
        storetype: stringOrNumber
    }),
});

export type TivTaamStore = z.infer<typeof TivTaamStoreSchema>; 
