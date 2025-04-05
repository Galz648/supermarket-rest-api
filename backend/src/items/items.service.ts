import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import { ObjectId } from 'mongodb';

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
        include: {
          prices: {
            include: {
              store: true,
            },
            orderBy: {
              timestamp: 'desc',
            },
            take: 1,
          },
        },
        orderBy: { name: 'asc' },
      });

      // Transform the items to include availability information
      return items.map(item => ({
        ...item,
        isAvailable: item.prices.length > 0,
        availableStores: item.prices.map(price => ({
          storeId: price.store.id,
          storeName: price.store.name,
          city: price.store.city,
          price: price.price,
          currency: price.currency,
          lastUpdated: price.timestamp
        }))
      }));
    } catch (error) {
      throw new Error(`Failed to search items: ${error.message}`);
    }
  }

  async getPriceByStoreIdAndItemId(chainObjectId: string, storeObjectId: string, itemObjectId: string) {
    // Validate that all IDs are valid MongoDB ObjectIds
    if (!ObjectId.isValid(chainObjectId)) {
      throw new NotFoundException(`Invalid chain ObjectId: ${chainObjectId}`);
    }
    if (!ObjectId.isValid(storeObjectId)) {
      throw new NotFoundException(`Invalid store ObjectId: ${storeObjectId}`);
    }
    if (!ObjectId.isValid(itemObjectId)) {
      throw new NotFoundException(`Invalid item ObjectId: ${itemObjectId}`);
    }

    return this.prisma.itemPrice.findFirst({
      where: {
        itemId: itemObjectId,
        store: {
          chainObjectId,
          id: storeObjectId
        }
      },
      include: {
        store: true,
        item: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }
} 
