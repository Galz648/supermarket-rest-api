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

  async createChain(data: { name: string }) {
    return this.prisma.chain.create({
      data,
    });
  }

  async updateChain(id: string, data: { name?: string }) {
    const chain = await this.prisma.chain.findUnique({ where: { id } });
    if (!chain) {
      throw new NotFoundException(`Chain with ID ${id} not found`);
    }
    return this.prisma.chain.update({
      where: { id },
      data,
    });
  }

  async deleteChain(id: string) {
    const chain = await this.prisma.chain.findUnique({ where: { id } });
    if (!chain) {
      throw new NotFoundException(`Chain with ID ${id} not found`);
    }
    return this.prisma.chain.delete({
      where: { id },
    });
  }
} 
