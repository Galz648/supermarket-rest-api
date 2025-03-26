import { z } from 'zod';

// Item schema
export const ShufersalItemSchema = z.object({
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

export type ShufersalItem = z.infer<typeof ShufersalItemSchema>;

