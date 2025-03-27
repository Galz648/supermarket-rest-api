import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) { }

  async findByName(name: string) {
    return this.prisma.item.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
  }

  async findAll() {
    // Simplified to just return all items without pagination
    const items = await this.prisma.item.findMany({
      orderBy: { name: 'asc' },
    });

    return items;
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        prices: {
          include: {
            store: true,
          },
          orderBy: {
            timestamp: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async findByBarcode(barcode: string) {
    const item = await this.prisma.item.findFirst({
      where: { itemCode: barcode },
      include: {
        prices: {
          include: {
            store: true,
          },
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with barcode ${barcode} not found`);
    }

    return item;
  }

  async search(query: string) {
    // Ensure query is a valid string
    const validQuery = query?.trim() || '';

    if (!validQuery) {
      return [];
    }

    return this.prisma.item.findMany({
      where: {
        OR: [
          { name: { contains: validQuery, mode: 'insensitive' } },
          { brand: { contains: validQuery, mode: 'insensitive' } },
          { category: { contains: validQuery, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
  }
} 
