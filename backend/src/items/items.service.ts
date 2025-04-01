import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) { }

  async findByName(name: string) {
    return this.prisma.item.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
      take: 10,
      orderBy: { name: 'asc' },
    });
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
    try {
      const where: Prisma.ItemWhereInput = {
        name: {
          contains: query,
          mode: 'insensitive',
        },
      };

      const items = await this.prisma.item.findMany({
        where,
        orderBy: { name: 'asc' },
      });
      return items;
    } catch (error) {
      throw new Error(`Failed to search items: ${error.message}`);
    }
  }

  // TODO: this is a temporary solution
  async getPriceByStoreIdAndItemId(chainName: string, storeId: string, itemId: string) {
    const item = await this.prisma.item.findFirst({
      where: { itemCode: itemId },
    });
    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    // find the chain id from the chain name
    const chain = await this.prisma.chain.findFirst({
      where: { name: chainName },
    });
    if (!chain) {
      throw new NotFoundException(`Chain with name ${chainName} not found`);
    }

    return this.prisma.itemPrice.findFirst({
      where: { chainId: chain.id, storeId, itemId: item.id },
      include: {
        store: true,
      },
    });
  }
} 
