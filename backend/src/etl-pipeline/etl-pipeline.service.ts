import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataAccessService, SupermarketChain } from './data-access.service.js';
import { TransformerFactory } from './transformers/transformer-factory.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { from, mergeMap, toArray } from 'rxjs';
import { firstValueFrom } from 'rxjs';

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
            const supportedChains = this.dataAccess.getSupportedChains();

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
    @Cron(CronExpression.EVERY_5_SECONDS)
    async dataAccessHealthCheck() {
        try {
            const healthStatus = await this.dataAccess.checkServiceHealth();
            this.logger.log(`DataAccessService health status: ${healthStatus.status}`);
        } catch (error) {
            this.logger.error(`Failed to check DataAccessService health: ${error.message}`);
        }
    }

    // Run every 30 seconds for demo/testing purposes
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
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

            // run the ETL pipeline for each context
            await this.runEtlPipeline(context);


            this.logger.log('ETL PIPELINE COMPLETED');
        } catch (error) {
            this.logger.error(`ETL PIPELINE FAILED: ${error.message}`);
        }
    }

    async runEtlPipeline(context: ETLContext) {
        // TODO: implement the ETL pipeline
        // all tasks in one function
        try {
            for (const chain of context.chains) {
                const storeList = await this.dataAccess.extractStoreData(chain);
                const transformer = this.transformerFactory.getTransformer(chain);
                const transformedStoreList = transformer.transformStoreData(storeList);
                console.log(`chain: ${chain}`);
                console.log(`transformed ${transformedStoreList.length} stores`);

                const chainData = await this.prisma.chain.upsert({
                    where: { name: chain },
                    update: { name: chain },
                    create: { name: chain }
                });


                const stores$ = from(transformedStoreList);

                // Process all stores concurrently (with a limit) and wait for completion
                const processedStores = await firstValueFrom(
                    stores$.pipe(
                        mergeMap(
                            (store) =>
                                this.prisma.store.upsert({
                                    where: {
                                        chainId_name_address: {
                                            chainId: chainData.id,
                                            name: store.row_content.storename,
                                            address: store.row_content.address,
                                        },
                                    },
                                    update: {},
                                    create: {
                                        name: store.row_content.storename,
                                        address: store.row_content.address,
                                        chainId: chainData.id,
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
