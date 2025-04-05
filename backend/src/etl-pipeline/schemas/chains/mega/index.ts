import { z } from 'zod';

// Helper function to handle both string and number values
const stringOrNumber = z.union([z.string(), z.number().transform(n => String(n))]);

// Example MEGA store data:
/*
{
    "row_content": {
        "chainid": "7290055700007",
        "lastupdatedate": "2025-04-04",
        "subchainid": "1",
        "storeid": "1",
        "storetype": "1",
        "chainname": "מגה",
        "subchainname": "מגה",
        "storename": "מגה בעיר",
        "address": "רחוב הרצל 100",
        "city": "תל-אביב",
        "zipcode": "64239"
    }
}
*/

// Store schema
export const megaStoreSchema = z.object({
    row_content: z.object({
        chainid: stringOrNumber,
        lastupdatedate: z.string(),
        subchainid: stringOrNumber,
        storeid: stringOrNumber,
        storetype: stringOrNumber,
        chainname: z.string(),
        subchainname: z.string(),
        storename: z.string(),
        address: z.string(),
        city: z.string(),
        zipcode: z.string()
    }),
});

export type MegaStore = z.infer<typeof megaStoreSchema>;

// Example MEGA product data:
/*
{
    "row_index": "1",
    "found_folder": "price_full",
    "file_name": "PriceFull7290055700007-001-202504040011.xml",
    "row_content": {
        "chainid": "7290055700007",
        "subchainid": "1",
        "storeid": "1",
        "bikoretno": "1",
        "priceupdatedate": "2025-04-04",
        "itemcode": "123456",
        "itemtype": "1",
        "itemname": "חלב טרה 3% שומן",
        "manufacturername": "טרה",
        "manufacturecountry": "ישראל",
        "manufactureritemdescription": "חלב טרה 3% שומן 1 ליטר",
        "unitqty": "1",
        "quantity": "1",
        "bisweighted": "0",
        "unitofmeasure": "ליטר",
        "qtyinpackage": "1",
        "itemprice": "6.90",
        "unitofmeasureprice": "6.90",
        "allowdiscount": "1",
        "itemstatus": "1"
    }
}
*/

// Item schema
export const megaProductSchema = z.object({
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

export type MegaProduct = z.infer<typeof megaProductSchema>; 
