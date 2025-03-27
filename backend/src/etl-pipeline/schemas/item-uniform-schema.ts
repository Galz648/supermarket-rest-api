import { z } from "zod";

export const UniformItemSchema = z.object({
    chainId: z.string(),
    storeId: z.string(),
    itemCode: z.string(),
    itemName: z.string(),
    manufacturerName: z.string(),
    manufactureCountry: z.string(),
    itemPrice: z.number(),
    itemStatus: z.string(),
    itemQuantity: z.number(),
    itemUnitOfMeasure: z.string(),
    itemUnitOfMeasurePrice: z.number(),
    updateDate: z.string(),
});

export type UniformItem = z.infer<typeof UniformItemSchema>;
