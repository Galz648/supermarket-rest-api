import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataAccessService, SupermarketChain } from './data-access.service.js';
import { ShufersalTransformerService } from './transformers/shufersal-transformer.service.js';
import { Transformer } from './transformers/transfomer.js';


@Injectable()
class TransformerFactory {
    private readonly transformers: Map<SupermarketChain, Transformer> = new Map();

    constructor(private readonly shufersalTransformer: ShufersalTransformerService) {
        this.transformers.set(SupermarketChain.SHUFERSAL, shufersalTransformer);
    }

    getTransformer(chain: SupermarketChain): Transformer {
        if (!this.transformers.has(chain)) {
            throw new Error(`No transformer found for chain: ${chain}`);
        }
        else {
            return this.transformers.get(chain)
        }
    }
}

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
    @Cron(CronExpression.EVERY_30_SECONDS)
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
        for (const chain of context.chains) {
            const storeList = await this.dataAccess.extractStoreData(chain);
            const transformer = this.transformerFactory.getTransformer(chain);
            const transformedStoreList = transformer.transformStoreData(storeList);
            console.log(`chain: ${chain}`);
            console.log(`storeList: ${JSON.stringify(storeList[0], null, 2)}`);
            console.log(`transformedStoreList: ${JSON.stringify(transformedStoreList, null, 2)}`);
            // const upsertedStoreList = await this.dataAccess.upsertStoreList(transformedStoreList);
            // const upsertedStoreList = await this.dataAccess.upsertStoreList(transformedStoreList);
        }
    }
}
