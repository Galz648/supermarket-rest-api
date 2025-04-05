import { z } from 'zod';

// Example VICTORY store data:
/*
{
    "store": {
        "chainid": "7290696200003",
        "chainname": "ויקטורי",
        "lastupdatedate": "2025-04-04",
        "lastupdatetime": "06:00:00",
        "subchainid": "1",
        "subchainname": "1",
        "storeid": "1",
        "bikoretno": "1",
        "storetype": "1",
        "storename": "סיטי אחד העם",
        "address": "אחד העם 54",
        "city": "תל-אביב",
        "zipcode": "unknown"
    }
}
*/

export const victoryStoreSchema = z.object({
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

export type VictoryStore = z.infer<typeof victoryStoreSchema>;

// Example data
export const victoryStoreExample: VictoryStore = {
    store: {
        chainid: "7290696200003",
        chainname: "ויקטורי",
        lastupdatedate: "2025-04-04",
        lastupdatetime: "06:00:00",
        subchainid: "1",
        subchainname: "1",
        storeid: "1",
        bikoretno: "1",
        storetype: "1",
        storename: "סיטי אחד העם",
        address: "אחד העם 54",
        city: "תל-אביב",
        zipcode: "unknown"
    }
};

// Example VICTORY product data:
/*
{
    "item": {
        "priceupdatedate": "2025-04-04",
        "itemid": "123456",
        "itemname": "חלב טרה 3% שומן",
        "manufacturername": "טרה",
        "manufacturercountry": "ישראל",
        "unitqty": "1",
        "quantity": "1",
        "unitofmeasure": "ליטר",
        "barcodes": ["7290000123456"],
        "status": "Active",
        "price": "6.90",
        "unitprice": "6.90",
        "allowdiscount": "1"
    }
}
*/

export const victoryProductSchema = z.object({
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

export type VictoryProduct = z.infer<typeof victoryProductSchema>;

export const victoryProductExamples: VictoryProduct[] = [
    {
        item: {
            priceupdatedate: "2025-04-04",
            itemid: "123456",
            itemname: "חלב טרה 3% שומן",
            manufacturername: "טרה",
            manufacturercountry: "ישראל",
            unitqty: "1",
            quantity: "1",
            unitofmeasure: "ליטר",
            barcodes: ["7290000123456"],
            status: "Active",
            price: "6.90",
            unitprice: "6.90",
            allowdiscount: "1"
        }
    },
    {
        item: {
            priceupdatedate: "2025-04-04",
            itemid: "123457",
            itemname: "לחם אחיד",
            manufacturername: "אחלה",
            manufacturercountry: "ישראל",
            unitqty: "1",
            quantity: "1",
            unitofmeasure: "יחידה",
            barcodes: ["7290000123457"],
            status: "Active",
            price: "5.90",
            unitprice: "5.90",
            allowdiscount: "1"
        }
    },
    {
        item: {
            priceupdatedate: "2025-04-04",
            itemid: "123458",
            itemname: "ביצים גדולות",
            manufacturername: "תנובה",
            manufacturercountry: "ישראל",
            unitqty: "12",
            quantity: "12",
            unitofmeasure: "יחידה",
            barcodes: ["7290000123458"],
            status: "Active",
            price: "15.90",
            unitprice: "1.33",
            allowdiscount: "1"
        }
    },
    {
        item: {
            priceupdatedate: "2025-04-04",
            itemid: "123459",
            itemname: "שמן זית כתית מעולה",
            manufacturername: "יד מרדכי",
            manufacturercountry: "ישראל",
            unitqty: "1",
            quantity: "750",
            unitofmeasure: "מ״ל",
            barcodes: ["7290000123459"],
            status: "Active",
            price: "39.90",
            unitprice: "53.20",
            allowdiscount: "1"
        }
    },
    {
        item: {
            priceupdatedate: "2025-04-04",
            itemid: "123460",
            itemname: "בננות",
            manufacturername: "חקלאי",
            manufacturercountry: "ישראל",
            unitqty: "1",
            quantity: "1",
            unitofmeasure: "ק״ג",
            barcodes: ["7290000123460"],
            status: "Active",
            price: "9.90",
            unitprice: "9.90",
            allowdiscount: "1"
        }
    }
];

export const victoryPromoExamples = [
    {
        promo_id: "1",
        chainid: "7290696200003",
        storeid: "1",
        itemid: "123456",
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
        itemid: "123457",
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
        itemid: "123458",
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
        itemid: "123459",
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
        itemid: "123460",
        itemname: "בננות",
        promo_price: "8.90",
        promo_start_date: "2025-04-04",
        promo_end_date: "2025-04-10",
        promo_type: "1",
        promo_description: "מבצע שבועי"
    }
]; 
