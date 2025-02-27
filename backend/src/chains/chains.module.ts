import { Module } from '@nestjs/common';
import { ChainsController } from './chains.controller.js';
import { ChainsService } from './chains.service.js';

@Module({
  controllers: [ChainsController],
  providers: [ChainsService],
  exports: [ChainsService],
})
export class ChainsModule { } 
