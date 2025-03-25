import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateItemDto } from './dto/create-item.dto.js';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    // Simplified to just return all items without pagination
    const items = await this.prisma.item.findMany({
      orderBy: { name: 'asc' },
    });

    return items;
  }

  async create(createItemDto: CreateItemDto) {
    return this.prisma.item.create({
      data: createItemDto,
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
