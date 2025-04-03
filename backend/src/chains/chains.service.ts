import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

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
    try {
      const chain = await this.prisma.chain.findUnique({
        where: { id },
        include: includeStores ? { stores: true } : undefined,
      });

      if (!chain) {
        throw new NotFoundException(`Chain with ID ${id} not found`);
      }

      return chain;
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  private handlePrismaError(error: unknown, id: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2023') {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
    }
    // Re-throw other errors
    throw error;
  }
} 
