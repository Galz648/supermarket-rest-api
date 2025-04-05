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

// Example TIV_TAAM store data:
/*
{
    "store": {
        "chainid": "7290873255550",
        "chainname": "טיב טעם",
        "lastupdatedate": "2025-04-04",
        "lastupdatetime": "01:10:00",
        "subchainid": "1",
        "subchainname": "1",
        "storeid": "6",
        "bikoretno": "1",
        "storetype": "1",
        "storename": "בת ים",
        "address": "אהוד קינמון 14",
        "city": "בת ים",
        "zipcode": "5959401"
    }
}
*/

// Store schema for Tiv Taam store data
export const tivTaamStoreSchema = z.object({
    store: z.object({
        chainid: z.string(),
        chainname: z.string(),
        lastupdatedate: z.string(),
        lastupdatetime: z.string(),
        subchainid: z.string(),
        subchainname: z.string(),
        storeid: z.string(),
        bikoretno: z.string(),
        storetype: z.string(),
        storename: z.string(),
        address: z.string(),
        city: z.string(),
        zipcode: z.string()
    })
});

export type TivTaamStore = z.infer<typeof tivTaamStoreSchema>;

// Example data
export const tivTaamStoreExample: TivTaamStore = {
    store: {
        chainid: "7290873255550",
        chainname: "טיב טעם",
        lastupdatedate: "2025-04-04",
        lastupdatetime: "01:10:00",
        subchainid: "1",
        subchainname: "1",
        storeid: "6",
        bikoretno: "1",
        storetype: "1",
        storename: "בת ים",
        address: "אהוד קינמון 14",
        city: "בת ים",
        zipcode: "5959401"
    }
};

export const tivTaamProductExamples: TivTaamProduct[] = [
    {
        row_index: "1",
        found_folder: "PriceFull",
        file_name: "PriceFull7290873255550-202504040110.xml",
        row_content: {
            chainid: "7290873255550",
            subchainid: "1",
            storeid: "6",
            bikoretno: "1",
            priceupdatedate: "2025-04-04",
            itemcode: "123456",
            itemtype: "1",
            itemname: "חלב טרה 3% שומן",
            manufacturername: "טרה",
            manufacturecountry: "ישראל",
            manufactureritemdescription: "חלב טרה 3% שומן",
            unitqty: "1",
            quantity: "1",
            bisweighted: "0",
            unitofmeasure: "ליטר",
            qtyinpackage: "1",
            itemprice: "6.90",
            unitofmeasureprice: "6.90",
            allowdiscount: "1",
            itemstatus: "1"
        }
    },
    {
        row_index: "2",
        found_folder: "PriceFull",
        file_name: "PriceFull7290873255550-202504040110.xml",
        row_content: {
            chainid: "7290873255550",
            subchainid: "1",
            storeid: "6",
            bikoretno: "1",
            priceupdatedate: "2025-04-04",
            itemcode: "123457",
            itemtype: "1",
            itemname: "לחם אחיד",
            manufacturername: "אחלה",
            manufacturecountry: "ישראל",
            manufactureritemdescription: "לחם אחיד",
            unitqty: "1",
            quantity: "1",
            bisweighted: "0",
            unitofmeasure: "יחידה",
            qtyinpackage: "1",
            itemprice: "5.90",
            unitofmeasureprice: "5.90",
            allowdiscount: "1",
            itemstatus: "1"
        }
    },
    {
        row_index: "3",
        found_folder: "PriceFull",
        file_name: "PriceFull7290873255550-202504040110.xml",
        row_content: {
            chainid: "7290873255550",
            subchainid: "1",
            storeid: "6",
            bikoretno: "1",
            priceupdatedate: "2025-04-04",
            itemcode: "123458",
            itemtype: "1",
            itemname: "ביצים גדולות",
            manufacturername: "תנובה",
            manufacturecountry: "ישראל",
            manufactureritemdescription: "ביצים גדולות",
            unitqty: "12",
            quantity: "12",
            bisweighted: "0",
            unitofmeasure: "יחידה",
            qtyinpackage: "1",
            itemprice: "15.90",
            unitofmeasureprice: "1.33",
            allowdiscount: "1",
            itemstatus: "1"
        }
    },
    {
        row_index: "4",
        found_folder: "PriceFull",
        file_name: "PriceFull7290873255550-202504040110.xml",
        row_content: {
            chainid: "7290873255550",
            subchainid: "1",
            storeid: "6",
            bikoretno: "1",
            priceupdatedate: "2025-04-04",
            itemcode: "123459",
            itemtype: "1",
            itemname: "שמן זית כתית מעולה",
            manufacturername: "יד מרדכי",
            manufacturecountry: "ישראל",
            manufactureritemdescription: "שמן זית כתית מעולה",
            unitqty: "1",
            quantity: "750",
            bisweighted: "0",
            unitofmeasure: "מ״ל",
            qtyinpackage: "1",
            itemprice: "39.90",
            unitofmeasureprice: "53.20",
            allowdiscount: "1",
            itemstatus: "1"
        }
    },
    {
        row_index: "5",
        found_folder: "PriceFull",
        file_name: "PriceFull7290873255550-202504040110.xml",
        row_content: {
            chainid: "7290873255550",
            subchainid: "1",
            storeid: "6",
            bikoretno: "1",
            priceupdatedate: "2025-04-04",
            itemcode: "123460",
            itemtype: "1",
            itemname: "בננות",
            manufacturername: "חקלאי",
            manufacturecountry: "ישראל",
            manufactureritemdescription: "בננות",
            unitqty: "1",
            quantity: "1",
            bisweighted: "1",
            unitofmeasure: "ק״ג",
            qtyinpackage: "1",
            itemprice: "9.90",
            unitofmeasureprice: "9.90",
            allowdiscount: "1",
            itemstatus: "1"
        }
    }
];

export const tivTaamPromoExamples = [
    {
        promo_id: "1",
        chainid: "7290873255550",
        storeid: "6",
        itemcode: "123456",
        itemname: "חלב טרה 3% שומן",
        promo_price: "5.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "2",
        chainid: "7290873255550",
        storeid: "6",
        itemcode: "123457",
        itemname: "לחם אחיד",
        promo_price: "4.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "3",
        chainid: "7290873255550",
        storeid: "6",
        itemcode: "123458",
        itemname: "ביצים גדולות",
        promo_price: "14.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "4",
        chainid: "7290873255550",
        storeid: "6",
        itemcode: "123459",
        itemname: "שמן זית כתית מעולה",
        promo_price: "34.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "5",
        chainid: "7290873255550",
        storeid: "6",
        itemcode: "123460",
        itemname: "בננות",
        promo_price: "8.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    }
]; 
