import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ChainsService {
  constructor(private prisma: PrismaService) { }

  async findAll(includeStores: boolean = false) {
    if (includeStores) {
      return this.prisma.chain.findMany({
        include: {
          stores: true,
        },
      });
    }
    return this.prisma.chain.findMany();
  }
  async findOne(id: string, includeStores: boolean = false) {
    const chain = await this.prisma.chain.findUnique({
      where: { id },
      include: {
        stores: includeStores,
      },
    });

    if (!chain) {
      throw new NotFoundException(`Chain with ID ${id} not found`);
    }

    return chain;
  }
} 
