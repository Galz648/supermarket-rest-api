import { z } from 'zod';

// Helper function to handle both string and number values
const stringOrNumber = z.union([z.string(), z.number().transform(n => String(n))]);

// Item schema for Rami Levy product data
export const RamiLevyProductSchema = z.object({
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
        itemnm: z.string(), // Note: Rami Levy uses 'itemnm' instead of 'itemname'
        manufacturername: z.string(),
        manufacturecountry: z.string(),
        manufactureritemdescription: z.string(),
        unitqty: z.string(),
        quantity: stringOrNumber,
        unitofmeasure: z.string(),
        bisweighted: stringOrNumber,
        qtyinpackage: stringOrNumber,
        itemprice: stringOrNumber,
        unitofmeasureprice: stringOrNumber,
        allowdiscount: stringOrNumber,
        itemstatus: stringOrNumber
    }),
});

export type RamiLevyProduct = z.infer<typeof RamiLevyProductSchema>;

// Store schema for Rami Levy store data
export const RamiLevyStoreSchema = z.object({
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

export type RamiLevyStore = z.infer<typeof RamiLevyStoreSchema>; 
