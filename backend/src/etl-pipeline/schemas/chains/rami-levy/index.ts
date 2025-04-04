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

// Example data
export const ramiLevyStoreExample: RamiLevyStore = {
    row_content: {
        chainid: "7290696200003",
        subchainid: "0",
        storeid: "001",
        bikoretno: "001",
        storename: "RAMI LEVY - TEL AVIV",
        address: "ROTHSCHILD 45",
        city: "5000", // Note: Rami Levy uses numeric codes for cities (5000 = Tel Aviv)
        zipcode: "6688116",
        lastupdate: "202504040524",
        storetype: "1"
    }
};

export const ramiLevyProductExample: RamiLevyProduct = {
    row_index: "1",
    found_folder: "PriceFull",
    file_name: "PriceFull7290696200003-001-202504040524.xml",
    row_content: {
        chainid: "7290696200003",
        subchainid: "0",
        storeid: "001",
        bikoretno: "001",
        priceupdatedate: "202504040524",
        itemcode: "7290000000001",
        itemtype: "1",
        itemnm: "MILK 1% 1L",
        manufacturername: "TNUVA",
        manufacturecountry: "IL",
        manufactureritemdescription: "MILK 1% 1L",
        unitqty: "1",
        quantity: "1",
        unitofmeasure: "L",
        bisweighted: "0",
        qtyinpackage: "1",
        itemprice: "5.90",
        unitofmeasureprice: "5.90",
        allowdiscount: "1",
        itemstatus: "1"
    }
};

export const ramiLevyProductExamples: RamiLevyProduct[] = [
    {
        row_index: "1",
        found_folder: "PriceFull",
        file_name: "PriceFull7290058140886-001-202504040524.xml",
        row_content: {
            chainid: "7290058140886",
            subchainid: "0",
            storeid: "001",
            bikoretno: "001",
            priceupdatedate: "202504040524",
            itemcode: "7290000000001",
            itemtype: "1",
            itemnm: "חלב טרה 3% שומן",
            manufacturername: "טרה",
            manufacturecountry: "ישראל",
            manufactureritemdescription: "חלב טרה 3% שומן",
            unitqty: "1",
            quantity: "1",
            unitofmeasure: "ליטר",
            bisweighted: "0",
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
        file_name: "PriceFull7290058140886-001-202504040524.xml",
        row_content: {
            chainid: "7290058140886",
            subchainid: "0",
            storeid: "001",
            bikoretno: "001",
            priceupdatedate: "202504040524",
            itemcode: "7290000000002",
            itemtype: "1",
            itemnm: "לחם אחיד",
            manufacturername: "אחלה",
            manufacturecountry: "ישראל",
            manufactureritemdescription: "לחם אחיד",
            unitqty: "1",
            quantity: "1",
            unitofmeasure: "יחידה",
            bisweighted: "0",
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
        file_name: "PriceFull7290058140886-001-202504040524.xml",
        row_content: {
            chainid: "7290058140886",
            subchainid: "0",
            storeid: "001",
            bikoretno: "001",
            priceupdatedate: "202504040524",
            itemcode: "7290000000003",
            itemtype: "1",
            itemnm: "ביצים גדולות",
            manufacturername: "תנובה",
            manufacturecountry: "ישראל",
            manufactureritemdescription: "ביצים גדולות",
            unitqty: "12",
            quantity: "12",
            unitofmeasure: "יחידה",
            bisweighted: "0",
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
        file_name: "PriceFull7290058140886-001-202504040524.xml",
        row_content: {
            chainid: "7290058140886",
            subchainid: "0",
            storeid: "001",
            bikoretno: "001",
            priceupdatedate: "202504040524",
            itemcode: "7290000000004",
            itemtype: "1",
            itemnm: "שמן זית כתית מעולה",
            manufacturername: "יד מרדכי",
            manufacturecountry: "ישראל",
            manufactureritemdescription: "שמן זית כתית מעולה",
            unitqty: "1",
            quantity: "750",
            unitofmeasure: "מ״ל",
            bisweighted: "0",
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
        file_name: "PriceFull7290058140886-001-202504040524.xml",
        row_content: {
            chainid: "7290058140886",
            subchainid: "0",
            storeid: "001",
            bikoretno: "001",
            priceupdatedate: "202504040524",
            itemcode: "7290000000005",
            itemtype: "1",
            itemnm: "בננות",
            manufacturername: "חקלאי",
            manufacturecountry: "ישראל",
            manufactureritemdescription: "בננות",
            unitqty: "1",
            quantity: "1",
            unitofmeasure: "ק״ג",
            bisweighted: "1",
            qtyinpackage: "1",
            itemprice: "9.90",
            unitofmeasureprice: "9.90",
            allowdiscount: "1",
            itemstatus: "1"
        }
    }
];

export const ramiLevyPromoExamples = [
    {
        promo_id: "1",
        chainid: "7290058140886",
        storeid: "001",
        itemcode: "7290000000001",
        itemname: "חלב טרה 3% שומן",
        promo_price: "5.90",
        promo_start_date: "20250404",
        promo_end_date: "20250410",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "2",
        chainid: "7290058140886",
        storeid: "001",
        itemcode: "7290000000002",
        itemname: "לחם אחיד",
        promo_price: "4.90",
        promo_start_date: "20250404",
        promo_end_date: "20250410",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "3",
        chainid: "7290058140886",
        storeid: "001",
        itemcode: "7290000000003",
        itemname: "ביצים גדולות",
        promo_price: "14.90",
        promo_start_date: "20250404",
        promo_end_date: "20250410",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "4",
        chainid: "7290058140886",
        storeid: "001",
        itemcode: "7290000000004",
        itemname: "שמן זית כתית מעולה",
        promo_price: "34.90",
        promo_start_date: "20250404",
        promo_end_date: "20250410",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "5",
        chainid: "7290058140886",
        storeid: "001",
        itemcode: "7290000000005",
        itemname: "בננות",
        promo_price: "8.90",
        promo_start_date: "20250404",
        promo_end_date: "20250410",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    }
]; 
