import { z } from 'zod';

// Helper function to handle both string and number values
const stringOrNumber = z.union([z.string(), z.number()]);

// Store Schema
export const bareketStoreSchema = z.object({
    chainid: z.string(),
    lastupdatedate: z.string(),
    storeid: z.string(),
    storename: z.string(),
    address: z.string(),
    city: z.string(),
    zipcode: z.string().optional(),
});

export type BareketStore = z.infer<typeof bareketStoreSchema>;

// Product Schema
export const bareketProductSchema = z.object({
    row_index: z.number(),
    found_folder: z.string(),
    file_name: z.string(),
    itemcode: stringOrNumber,
    itemname: z.string(),
    manufacturername: z.string().optional(),
    manufacturercountry: z.string().optional(),
    unitqty: z.string().optional(),
    quantity: z.string().optional(),
    unitofmeasure: z.string().optional(),
    barcodes: z.array(z.string()).optional(),
    status: z.string().optional(),
    price: z.number(),
    unitprice: z.number().optional(),
    allowdiscount: z.number().optional(),
});

export type BareketProduct = z.infer<typeof bareketProductSchema>;

// Example data
export const bareketStoreExample: BareketStore = {
    chainid: "7290875100001",
    lastupdatedate: "202504040524",
    storeid: "062",
    storename: "BAREKET - TEL AVIV",
    address: "ROTHSCHILD 45",
    city: "TEL AVIV",
    zipcode: "6688116"
};

export const bareketProductExample: BareketProduct = {
    row_index: 1,
    found_folder: "PriceFull",
    file_name: "PriceFull7290875100001-062-202504040524.aspx.xml",
    itemcode: "7290000000001",
    itemname: "MILK 1% 1L",
    manufacturername: "TNUVA",
    manufacturercountry: "IL",
    unitqty: "1",
    quantity: "1",
    unitofmeasure: "L",
    barcodes: ["7290000000001"],
    status: "1",
    price: 5.90,
    unitprice: 5.90,
    allowdiscount: 1
};

export const bareketProductExamples: BareketProduct[] = [
    {
        row_index: 1,
        found_folder: "PriceFull",
        file_name: "PriceFull7290696200003-202504040600.xml",
        itemcode: "234567",
        itemname: "חלב טרה 3% שומן",
        manufacturername: "טרה",
        manufacturercountry: "ישראל",
        unitqty: "1",
        quantity: "1",
        unitofmeasure: "ליטר",
        price: 6.90,
        allowdiscount: 1
    },
    {
        row_index: 2,
        found_folder: "PriceFull",
        file_name: "PriceFull7290696200003-202504040600.xml",
        itemcode: "234568",
        itemname: "לחם אחיד",
        manufacturername: "אחלה",
        manufacturercountry: "ישראל",
        unitqty: "1",
        quantity: "1",
        unitofmeasure: "יחידה",
        price: 5.90,
        allowdiscount: 1
    },
    {
        row_index: 3,
        found_folder: "PriceFull",
        file_name: "PriceFull7290696200003-202504040600.xml",
        itemcode: "234569",
        itemname: "ביצים גדולות",
        manufacturername: "תנובה",
        manufacturercountry: "ישראל",
        unitqty: "12",
        quantity: "12",
        unitofmeasure: "יחידה",
        price: 15.90,
        allowdiscount: 1
    },
    {
        row_index: 4,
        found_folder: "PriceFull",
        file_name: "PriceFull7290696200003-202504040600.xml",
        itemcode: "234570",
        itemname: "שמן זית כתית מעולה",
        manufacturername: "יד מרדכי",
        manufacturercountry: "ישראל",
        unitqty: "1",
        quantity: "750",
        unitofmeasure: "מ״ל",
        price: 39.90,
        allowdiscount: 1
    },
    {
        row_index: 5,
        found_folder: "PriceFull",
        file_name: "PriceFull7290696200003-202504040600.xml",
        itemcode: "234571",
        itemname: "בננות",
        manufacturername: "חקלאי",
        manufacturercountry: "ישראל",
        unitqty: "1",
        quantity: "1",
        unitofmeasure: "ק״ג",
        price: 9.90,
        allowdiscount: 1
    }
];

export const bareketPromoExamples = [
    {
        promo_id: "1",
        chainid: "7290696200003",
        storeid: "1",
        itemid: "234567",
        itemname: "חלב טרה 3% שומן",
        promo_price: "5.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "2",
        chainid: "7290696200003",
        storeid: "1",
        itemid: "234568",
        itemname: "לחם אחיד",
        promo_price: "4.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "3",
        chainid: "7290696200003",
        storeid: "1",
        itemid: "234569",
        itemname: "ביצים גדולות",
        promo_price: "14.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "4",
        chainid: "7290696200003",
        storeid: "1",
        itemid: "234570",
        itemname: "שמן זית כתית מעולה",
        promo_price: "34.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "5",
        chainid: "7290696200003",
        storeid: "1",
        itemid: "234571",
        itemname: "בננות",
        promo_price: "8.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    }
]; 
