import { Module } from '@nestjs/common';
import { ChainsController } from './chains.controller.js';
import { ChainsService } from './chains.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ChainsController],
  providers: [ChainsService],
  exports: [ChainsService],
})
export class ChainsModule { } 
