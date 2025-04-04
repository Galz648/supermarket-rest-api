import { z } from 'zod';

// Common schema elements shared by all chains
const commonStoreSchema = z.object({
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
});

// TIV_TAAM schema
export const tivTaamStoreSchema = z.object({
  store: commonStoreSchema
});

// VICTORY schema
export const victoryStoreSchema = z.object({
  store: commonStoreSchema
});

// YOHANANOF schema
export const yohananofStoreSchema = z.object({
  store: commonStoreSchema
});

// Type exports
export type TivTaamStore = z.infer<typeof tivTaamStoreSchema>;
export type VictoryStore = z.infer<typeof victoryStoreSchema>;
export type YohananofStore = z.infer<typeof yohananofStoreSchema>; 
