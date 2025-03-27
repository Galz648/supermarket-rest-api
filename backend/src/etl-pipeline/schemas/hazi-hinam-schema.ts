/*
{
    "row_index": "1",
    "found_folder": "app_data/dumps/HaziHinam",
    "file_name": "Price7290700100008-000-206-20250327-043907.gz.xml.xml",
    "row_content": {
      "chainid": "7290700100008",
      "subchainid": "000",
      "storeid": "206",
      "bikoretno": "4",
      "priceupdatetime": "2025-01-07T13:47:58.000",
      "itemcode": "497112",
      "lastsaledatetime": "2025-03-26T22:14:00.000",
      "itemtype": "0",
      "itemname": "לחם אחיד כהה פרוס 750 גרם.",
      "manufacturename": "manufacturename",
      "manufacturecountry": "manufacturecountry",
      "manufactureitemdescription": "לחם אחיד כהה פרוס 750 גרם.",
      "unitqty": "גרם",
      "quantity": "750",
      "unitofmeasure": "100גרם",
      "bisweighted": "0",
      "qtyinpackage": "qtyinpackage",
      "itemprice": "8.38",
      "unitofmeasureprice": "1.12",
      "allowdiscount": "1",
      "itemstatus": "1"
    }
  }
*/

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
