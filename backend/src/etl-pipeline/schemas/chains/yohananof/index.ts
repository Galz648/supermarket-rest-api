import { z } from 'zod';

// Example YOHANANOF store data:
/*
{
    "store": {
        "chainid": "7290803800003",
        "chainname": "מ. יוחננוף ובניו",
        "lastupdatedate": "2025-04-04",
        "lastupdatetime": "01:00:00",
        "subchainid": "1",
        "subchainname": "1",
        "storeid": "1",
        "bikoretno": "6",
        "storetype": "1",
        "storename": "יוחננוף מפוח",
        "address": "רחוב המפוח 11, אזור התעשיה",
        "city": "רחובות",
        "zipcode": "unknown"
    }
}
*/

export const yohananofStoreSchema = z.object({
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

export type YohananofStore = z.infer<typeof yohananofStoreSchema>;

// Example YOHANANOF product data:
/*
{
    "item": {
        "priceupdatedate": "2025-04-04",
        "itemid": "789012",
        "itemname": "שמן זית כתית מעולה",
        "manufacturername": "יד מרדכי",
        "manufacturercountry": "ישראל",
        "unitqty": "1",
        "quantity": "750",
        "unitofmeasure": "מ״ל",
        "barcodes": ["7290000789012"],
        "status": "Active",
        "price": "39.90",
        "unitprice": "53.20",
        "allowdiscount": "1"
    }
}
*/

export const yohananofProductSchema = z.object({
    item: z.object({
        priceupdatedate: z.string(),
        itemid: z.string(),
        itemname: z.string(),
        manufacturername: z.string(),
        manufacturercountry: z.string(),
        unitqty: z.string(),
        quantity: z.string(),
        unitofmeasure: z.string(),
        barcodes: z.array(z.string()),
        status: z.string(),
        price: z.string(),
        unitprice: z.string(),
        allowdiscount: z.string()
    })
});

export type YohananofProduct = z.infer<typeof yohananofProductSchema>;

// Example data
export const yohananofStoreExample: YohananofStore = {
    store: {
        chainid: "7290803800003",
        chainname: "מ. יוחננוף ובניו",
        lastupdatedate: "2025-04-04",
        lastupdatetime: "01:00:00",
        subchainid: "1",
        subchainname: "1",
        storeid: "1",
        bikoretno: "6",
        storetype: "1",
        storename: "יוחננוף מפוח",
        address: "רחוב המפוח 11, אזור התעשיה",
        city: "רחובות",
        zipcode: "unknown"
    }
};

export const yohananofProductExample: YohananofProduct = {
    item: {
        priceupdatedate: "2025-04-04",
        itemid: "789012",
        itemname: "שמן זית כתית מעולה",
        manufacturername: "יד מרדכי",
        manufacturercountry: "ישראל",
        unitqty: "1",
        quantity: "750",
        unitofmeasure: "מ״ל",
        barcodes: ["7290000789012"],
        status: "Active",
        price: "39.90",
        unitprice: "53.20",
        allowdiscount: "1"
    }
};

export const yohananofProductExamples: YohananofProduct[] = [
    {
        item: {
            priceupdatedate: "2025-04-04",
            itemid: "789012",
            itemname: "חלב טרה 3% שומן",
            manufacturername: "טרה",
            manufacturercountry: "ישראל",
            unitqty: "1",
            quantity: "1",
            unitofmeasure: "ליטר",
            barcodes: ["7290000789012"],
            status: "Active",
            price: "6.90",
            unitprice: "6.90",
            allowdiscount: "1"
        }
    },
    {
        item: {
            priceupdatedate: "2025-04-04",
            itemid: "789013",
            itemname: "לחם אחיד",
            manufacturername: "אחלה",
            manufacturercountry: "ישראל",
            unitqty: "1",
            quantity: "1",
            unitofmeasure: "יחידה",
            barcodes: ["7290000789013"],
            status: "Active",
            price: "5.90",
            unitprice: "5.90",
            allowdiscount: "1"
        }
    },
    {
        item: {
            priceupdatedate: "2025-04-04",
            itemid: "789014",
            itemname: "ביצים גדולות",
            manufacturername: "תנובה",
            manufacturercountry: "ישראל",
            unitqty: "12",
            quantity: "12",
            unitofmeasure: "יחידה",
            barcodes: ["7290000789014"],
            status: "Active",
            price: "15.90",
            unitprice: "1.33",
            allowdiscount: "1"
        }
    },
    {
        item: {
            priceupdatedate: "2025-04-04",
            itemid: "789015",
            itemname: "שמן זית כתית מעולה",
            manufacturername: "יד מרדכי",
            manufacturercountry: "ישראל",
            unitqty: "1",
            quantity: "750",
            unitofmeasure: "מ״ל",
            barcodes: ["7290000789015"],
            status: "Active",
            price: "39.90",
            unitprice: "53.20",
            allowdiscount: "1"
        }
    },
    {
        item: {
            priceupdatedate: "2025-04-04",
            itemid: "789016",
            itemname: "בננות",
            manufacturername: "חקלאי",
            manufacturercountry: "ישראל",
            unitqty: "1",
            quantity: "1",
            unitofmeasure: "ק״ג",
            barcodes: ["7290000789016"],
            status: "Active",
            price: "9.90",
            unitprice: "9.90",
            allowdiscount: "1"
        }
    }
];

export const yohananofPromoExamples = [
    {
        promo_id: "1",
        chainid: "7290803800003",
        storeid: "1",
        itemid: "789012",
        itemname: "חלב טרה 3% שומן",
        promo_price: "5.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "2",
        chainid: "7290803800003",
        storeid: "1",
        itemid: "789013",
        itemname: "לחם אחיד",
        promo_price: "4.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "3",
        chainid: "7290803800003",
        storeid: "1",
        itemid: "789014",
        itemname: "ביצים גדולות",
        promo_price: "14.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "4",
        chainid: "7290803800003",
        storeid: "1",
        itemid: "789015",
        itemname: "שמן זית כתית מעולה",
        promo_price: "34.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    },
    {
        promo_id: "5",
        chainid: "7290803800003",
        storeid: "1",
        itemid: "789016",
        itemname: "בננות",
        promo_price: "8.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    }
]; 
