import { Controller, Post, UseGuards } from '@nestjs/common';
import { EtlPipelineService } from './etl-pipeline.service.js';
import { DevelopmentGuard } from '../guards/development.guard.js';

@Controller('etl-pipeline')
export class EtlPipelineController {
    constructor(private readonly etlPipelineService: EtlPipelineService) { }

    @Post('run-etl-pipeline')
    @UseGuards(DevelopmentGuard)
    async runEtlPipeline() {
        return this.etlPipelineService.runEtlPipelineJob();
    }
}



