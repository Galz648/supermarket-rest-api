import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ChainsService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.chain.findMany({
      include: {
        stores: true,
      },
    });
  }

  async findOne(id: string) {
    const chain = await this.prisma.chain.findUnique({
      where: { id },
      include: {
        stores: true,
      },
    });

    if (!chain) {
      throw new NotFoundException(`Chain with ID ${id} not found`);
    }

    return chain;
  }
} 
