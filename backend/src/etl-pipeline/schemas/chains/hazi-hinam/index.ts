import { z } from 'zod';

// Helper function to handle both string and number values
const stringOrNumber = z.union([z.string(), z.number().transform(n => String(n))]);

// Item schema for Hazi-Hinam product data
export const HaziHinamProductSchema = z.object({
    row_index: stringOrNumber,
    found_folder: z.string(),
    file_name: z.string(),
    row_content: z.object({
        chainid: stringOrNumber,
        subchainid: stringOrNumber,
        storeid: stringOrNumber,
        bikoretno: stringOrNumber,
        priceupdatetime: z.string(),
        itemcode: stringOrNumber,
        lastsaledatetime: z.string().optional(),
        itemtype: stringOrNumber,
        itemname: z.string(),
        manufacturename: z.string(),
        manufacturecountry: z.string(),
        manufactureitemdescription: z.string(),
        unitqty: z.string(),
        quantity: stringOrNumber,
        unitofmeasure: z.string(),
        bisweighted: stringOrNumber,
        qtyinpackage: z.string().optional(),
        itemprice: stringOrNumber,
        unitofmeasureprice: stringOrNumber,
        allowdiscount: stringOrNumber,
        itemstatus: stringOrNumber
    }),
});

export type HaziHinamProduct = z.infer<typeof HaziHinamProductSchema>;

// Store schema for Hazi-Hinam store data
export const HaziHinamStoreSchema = z.object({
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

export type HaziHinamStore = z.infer<typeof HaziHinamStoreSchema>;

export const HaziHinamItemPromotionSchema = z.object({
    row_index: stringOrNumber,
    found_folder: z.string(),
    file_name: z.string(),
    row_content: z.object({
        chainid: stringOrNumber,
        subchainid: stringOrNumber,
        storeid: stringOrNumber,
        bikoretno: stringOrNumber,
        itemcode: stringOrNumber,
        itemname: z.string(),
        itemtype: stringOrNumber,
        itemstatus: stringOrNumber,
        allowdiscount: stringOrNumber,
        itemprice: stringOrNumber,
        unitofmeasureprice: stringOrNumber,
        unitofmeasure: z.string(),
        quantity: stringOrNumber,
        unitqty: z.string(),
    }),
});

export type HaziHinamItemPromotion = z.infer<typeof HaziHinamItemPromotionSchema>; 
