import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EtlPipelineService } from './etl-pipeline.service.js';
import { DataAccessService } from './data-access.service.js';
import { TransformerFactory } from './transformers/transformer-factory.js';
import { ShufersalTransformerService } from './transformers/shufersal-transformer.service.js';
import { HaziHinamTransformerService } from './transformers/hazi-hinam-transformer.service.js';
import { RamiLevyTransformerService } from './transformers/rami-levy-transformer.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { EtlPipelineController } from './etl-pipeline.controller.js';

@Module({
    imports: [
        ConfigModule,
        ScheduleModule.forRoot(),
        PrismaModule,
    ],
    controllers: [EtlPipelineController],
    providers: [
        EtlPipelineService,
        DataAccessService,
        TransformerFactory,
        ShufersalTransformerService,
        HaziHinamTransformerService,
        RamiLevyTransformerService,
    ],
    exports: [
        EtlPipelineService,
        DataAccessService,
        TransformerFactory,
    ],
})
export class EtlPipelineModule { } 
