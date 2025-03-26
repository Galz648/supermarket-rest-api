import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EtlPipelineService } from './etl-pipeline.service.js';
import { ShufersalTransformerService } from './transformers/shufersal-transformer.service.js';
import { DataAccessService } from './data-access.service.js';

@Module({
    imports: [
        ConfigModule,
        ScheduleModule.forRoot(),
    ],
    providers: [
        EtlPipelineService,
        DataAccessService,
        ShufersalTransformerService,
    ],
    exports: [
        EtlPipelineService,
        DataAccessService,
        ShufersalTransformerService,
    ],
})
export class EtlPipelineModule { } 
