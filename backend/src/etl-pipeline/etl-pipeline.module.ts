import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EtlPipelineService } from './etl-pipeline.service.js';
import { DataAccessService } from './data-access.service.js';
import { ShufersalTransformerService } from './processing/transformers/shufersal-transformer.service.js';
import { HaziHinamTransformerService } from './processing/transformers/hazi-hinam-transformer.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { EtlPipelineController } from './etl-pipeline.controller.js';
import { ChainRegistryService } from './processing/registry/chain-registry.service.js';

@Module({
    imports: [
        ConfigModule,
        ScheduleModule.forRoot(),
        PrismaModule,
    ],
    controllers: [EtlPipelineController],
    providers: [
        // Core services
        EtlPipelineService,
        DataAccessService,

        // Transformers
        ShufersalTransformerService,
        HaziHinamTransformerService,

        // Registry
        ChainRegistryService,
    ],
    exports: [
        // Core services
        EtlPipelineService,
        DataAccessService,

        // Registry
        ChainRegistryService,
    ],
})
export class EtlPipelineModule { } 
