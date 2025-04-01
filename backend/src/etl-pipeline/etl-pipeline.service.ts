import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataAccessService, SupermarketChain } from './data-access.service.js';
import { TransformerFactory } from './transformers/transformer-factory.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { from, mergeMap, toArray } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { getSupportedChains } from './data-access.service.js';
interface ETLContext {
    chains: SupermarketChain[]
}



// Enum of all chains that can be processed by the ETL pipeline
@Injectable()
export class EtlPipelineService {
    private readonly logger = new Logger(EtlPipelineService.name);

    constructor(
        private readonly dataAccess: DataAccessService,
        private readonly transformerFactory: TransformerFactory,
        private readonly prisma: PrismaService,
    ) { }


    async determineChainsToProcess(): Promise<SupermarketChain[]> {
        try {
            const availableChains = await this.dataAccess.listAvailableChains();
            const supportedChains = getSupportedChains();

            // Filter and cast valid chains to SupermarketChain enum
            // TODO: determine this is the correct way to do this
            return availableChains
                .filter(chain => supportedChains.includes(chain as SupermarketChain))
                .map(chain => chain as SupermarketChain);
        } catch (error) {
            this.logger.error(`Failed to determine chains to process: ${error.message}`);
            return [];
        }
    }
    // @Cron(CronExpression.EVERY_5_SECONDS)
    // async dataAccessHealthCheck() {
    //     try {
    //         const healthStatus = await this.dataAccess.checkServiceHealth();
    //         this.logger.log(`DataAccessService health status: ${healthStatus.status}`);
    //     } catch (error) {
    //         this.logger.error(`Failed to check DataAccessService health: ${error.message}`);
    //     }
    // }

    // Run every 30 seconds for demo/testing purposes
    @Cron(CronExpression.EVERY_5_MINUTES)
    async runEtlPipelineJob() {
        this.logger.log('========================================================');
        this.logger.log('STARTING ETL PIPELINE EXECUTION');
        this.logger.log('========================================================');

        try {

            const chainsToProcess = await this.determineChainsToProcess();
            this.logger.log(`Found ${chainsToProcess.length} supported chains to process`);
            // create a new ETLContext for each chain

            const context: ETLContext = {
                chains: chainsToProcess
            };

            // write a task runner with rxjs

            const tasks = [
                // run the ETL pipeline for each context
                // await this.upsertStoresPipeline(context),
                await this.upsertProductsPipeline(context),

            ]

            tasks.forEach(async (task) => {
                await task;
            });

        } catch (error) {
            this.logger.error(`ETL PIPELINE FAILED: ${error.message}`);
        }
    }


    async upsertProductsPipeline(context: ETLContext) {
        // TODO: implement the ETL pipeline
        try {
            for (const chain of context.chains) {
                const productList = await this.dataAccess.extractProductData(chain);
                const transformer = this.transformerFactory.getTransformer(chain);
                const transformedProductList = transformer.transformProductData(productList);
                console.log(`chain: ${chain}`);
                console.log(`transformed ${transformedProductList.length} products`);
                return await firstValueFrom(
                    from(transformedProductList).pipe(
                        mergeMap(
                            async (product) => {
                                // First upsert the item
                                const item = await this.prisma.item.upsert({
                                    where: { itemCode: product.itemCode },
                                    update: {
                                        name: product.itemName,
                                        unit: product.itemUnitOfMeasure,
                                        category: product.itemStatus,
                                        brand: product.manufacturerName
                                    },
                                    create: {
                                        itemCode: product.itemCode,
                                        name: product.itemName,
                                        unit: product.itemUnitOfMeasure,
                                        category: product.itemStatus,
                                        brand: product.manufacturerName
                                    }
                                });


                                const chainObject = await this.prisma.chain.findUnique({
                                    where: {
                                        name: chain
                                    }
                                });

                                const storeObject = await this.prisma.store.findUnique({
                                    where: {
                                        chainName_storeId: {
                                            chainName: chain,
                                            storeId: product.storeId,
                                        }
                                    }
                                });

                                // Then create/upsert the price data
                                return this.prisma.itemPrice.upsert({
                                    where: {
                                        unique_price_entry: {
                                            chainId: chain,
                                            storeId: product.storeId,
                                            itemId: item.id,
                                            timestamp: new Date(Date.now())
                                        }
                                    },
                                    update: {
                                        price: product.itemPrice,
                                        currency: "ILS", // Default currency for Israel TODO: determine if this is the correct way to do this
                                    },
                                    create: {
                                        itemId: item.id,
                                        itemCode: product.itemCode,
                                        price: product.itemPrice,
                                        currency: "ILS", // Default currency for Israel TODO: determine if this is the correct way to do this
                                        storeId: product.storeId,
                                        storeInternalId: storeObject!.id,
                                        chainId: chainObject!.id, // TODO: this his a hack to get the (!) chain object
                                        timestamp: new Date(Date.now())
                                    }
                                });
                            },
                            5 // <-- concurrency limit
                        ),
                        toArray() // collect all results before completing
                    )
                );


            }
        } catch (error) {
            this.logger.error(`Failed to run ETL pipeline: ${error.message}`);
        }
    }

    // async upsertItemDiscountsPipeline(context: ETLContext) {
    //     // TODO: implement the ETL pipeline
    //     try {
    //         for (const chain of context.chains) {
    //             const itemDiscountList = await this.dataAccess.extractItemDiscountData(chain);
    //             const transformer = this.transformerFactory.getTransformer(chain);
    //             const transformedItemDiscountList = transformer.transformItemDiscountData(itemDiscountList);
    //             console.log(`chain: ${chain}`);
    //             console.log(`transformed ${transformedItemDiscountList.length} item discounts`);
    //         }
    //     } catch (error) {
    //         this.logger.error(`Failed to run ETL pipeline: ${error.message}`);
    //     }
    // }
    // TODO: upsertItem
    async upsertStoresPipeline(context: ETLContext) {
        // TODO: implement the ETL pipeline
        try {
            for (const chain of context.chains) {
                const storeList = await this.dataAccess.extractStoreData(chain);
                const transformer = this.transformerFactory.getTransformer(chain);
                const transformedStoreList = transformer.transformStoreData(storeList);
                console.log(`chain: ${chain}`);
                console.log(`transformed ${transformedStoreList.length} stores`);

                await this.prisma.chain.upsert({
                    where: { name: chain },
                    update: { name: chain },
                    create: { name: chain }
                });


                // TODO: determine if there is a more efficient prisma/rxjs/raw query way to do this
                const stores$ = from(transformedStoreList);
                // TODO: determine if this is the idiomatic rxjs way to do this
                // Process all stores concurrently (with a limit) and wait for completion
                const processedStores = await firstValueFrom(
                    stores$.pipe(
                        mergeMap(
                            (store) =>
                                this.prisma.store.upsert({
                                    where: {
                                        chainName_storeId: {
                                            chainName: chain,
                                            storeId: store.storeId,
                                        },
                                    },
                                    update: { // TODO: determine if this needs a storeId field
                                        name: store.name,
                                        address: store.address,
                                        chainName: chain,
                                        city: store.city,
                                        zipCode: store.zipCode,
                                    },
                                    create: {
                                        storeId: store.storeId,
                                        name: store.name,
                                        address: store.address,
                                        city: store.city,
                                        zipCode: store.zipCode,
                                        chainName: chain,
                                    },
                                }),
                            5 // <-- concurrency limit
                        ),
                        toArray() // collect all results before completing
                    )
                );

                this.logger.log(`Successfully upserted ${processedStores.length} stores for chain ${chain}`);
            }
        } catch (error) {
            this.logger.error(`Failed to run ETL pipeline: ${error.message}`);
        }
    }
}

