import { z } from 'zod';

// Item schema
export const ShufersalProductSchema = z.object({
    row_index: z.string(),
    found_folder: z.string(),
    file_name: z.string(),
    row_content: z.object({
        chainid: z.string(),
        subchainid: z.string(),
        storeid: z.string(),
        bikoretno: z.string(),
        priceupdatedate: z.string(),
        itemcode: z.string(),
        itemtype: z.string(),
        itemname: z.string(),
        manufacturername: z.string(),
        manufacturecountry: z.string(),
        manufactureritemdescription: z.string(),
        unitqty: z.string(),
        quantity: z.string(),
        bisweighted: z.string(),
        unitofmeasure: z.string(),
        qtyinpackage: z.string(),
        itemprice: z.string(),
        unitofmeasureprice: z.string(),
        allowdiscount: z.string(),
        itemstatus: z.string(),
    }),
});

export type ShufersalProduct = z.infer<typeof ShufersalProductSchema>;

// Store schema
export const ShufersalStoreSchema = z.object({
    row_content: z.object({
        chainid: z.string(),
        lastupdatedate: z.string(),
        subchainid: z.string(),
        storeid: z.string(),
        storetype: z.string(),
        chainname: z.string(),
        subchainname: z.string(),
        storename: z.string(),
        address: z.string(),
        city: z.string(),
        zipcode: z.string()
    }),
});

export type ShufersalStore = z.infer<typeof ShufersalStoreSchema>;



/*
SHUFERSAL product example:


    {
      "row_index": "1",
      "found_folder": "app_data/dumps/Shufersal",
      "file_name": "Price7290027600007-352-202503270200.xml",
      "row_content": {
        "chainid": "7290027600007",
        "subchainid": "005",
        "storeid": "352",
        "bikoretno": "0",
        "priceupdatedate": "2025-03-27 00:20",
        "itemcode": "16000548503",
        "itemtype": "1",
        "itemname": "נייטשר וואלי מייפל 5יח",
        "manufacturername": "גנרל מילס סאן אדריאן",
        "manufacturecountry": "ES",
        "manufactureritemdescription": "נייטשר וואלי מייפל 5יח",
        "unitqty": "גרמים",
        "quantity": "210.00",
        "bisweighted": "0",
        "unitofmeasure": "100 גרם",
        "qtyinpackage": "0",
        "itemprice": "24.90",
        "unitofmeasureprice": "11.86",
        "allowdiscount": "1",
        "itemstatus": "0"
      }
    },

    {
      "row_index": "2",
      "found_folder": "app_data/dumps/Shufersal",
      "file_name": "Price7290027600007-352-202503270200.xml",
      "row_content": {
        "chainid": "7290027600007",
        "subchainid": "005",
        "storeid": "352",
        "bikoretno": "0",
        "priceupdatedate": "2025-03-27 01:20",
        "itemcode": "192333211779",
        "itemtype": "1",
        "itemname": "קליניק סרום מויסטר 50מ\"ל",
        "manufacturername": "אסתי לאודר",
        "manufacturecountry": "GB",
        "manufactureritemdescription": "קליניק סרום מויסטר 50מ\"ל",
        "unitqty": "מיליליטרים",
        "quantity": "50.00",
        "bisweighted": "0",
        "unitofmeasure": "100 מ\"ל",
        "qtyinpackage": "1",
        "itemprice": "249.00",
        "unitofmeasureprice": "498.00",
        "allowdiscount": "1",
        "itemstatus": "0"
      }











*/
