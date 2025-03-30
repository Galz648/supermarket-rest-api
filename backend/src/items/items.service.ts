import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) { }

  /**
   * Get all items with pagination
   * @param page - Page number (1-based)
   * @param limit - Number of items per page
   * @returns Object containing items and pagination metadata
   */
  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await this.prisma.item.count({
      where: {
        itemCode: { not: '' }
      }
    });

    // Get paginated items
    const items = await this.prisma.item.findMany({
      where: {
        itemCode: { not: '' }
      },
      orderBy: { name: 'asc' },
      skip,
      take: limit,
    });

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // TODO: Add price history aggregation (min, max, avg)
  // TODO: Add price trend analysis
  // TODO: Add store availability information
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

  // TODO: Add price history aggregation
  // TODO: Add store availability information
  // TODO: Add price comparison across stores
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

  /**
   * Search for items by name, brand, or category
   * @param query - Search query string (case-insensitive)
   * @param limit - Maximum number of results to return (default: 20)
   * @param category - Filter by category
   * @param brand - Filter by brand
   * @returns Array of matching items
   */
  async search(query: string, limit: number = 20, category?: string, brand?: string) {
    // Ensure query is a valid string
    const validQuery = query?.trim() || '';

    if (!validQuery) {
      return [];
    }

    const conditions: Prisma.ItemWhereInput[] = [
      {
        OR: [
          { name: { contains: validQuery, mode: Prisma.QueryMode.insensitive } },
          { brand: { contains: validQuery, mode: Prisma.QueryMode.insensitive } },
          { category: { contains: validQuery, mode: Prisma.QueryMode.insensitive } },
        ],
      },
    ];

    // Add category filter if provided
    if (category) {
      conditions.push({
        category: { contains: category, mode: Prisma.QueryMode.insensitive },
      });
    }

    // Add brand filter if provided
    if (brand) {
      conditions.push({
        brand: { contains: brand, mode: Prisma.QueryMode.insensitive },
      });
    }

    return this.prisma.item.findMany({
      where: {
        AND: conditions,
      },
      take: limit,
      orderBy: { name: 'asc' },
    });
  }
} 
