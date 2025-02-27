import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    return this.prisma.item.create({
      data: createItemDto,
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.item.count(),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        prices: {
          include: {
            supermarket: true,
          },
          orderBy: {
            effectiveDate: 'desc',
          },
          take: 10,
        },
        discounts: {
          include: {
            supermarket: true,
          },
          where: {
            endDate: {
              gte: new Date(),
            },
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    return item;
  }

  async search(query: string) {
    return this.prisma.item.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { manufacturer: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    try {
      return await this.prisma.item.update({
        where: { id },
        data: updateItemDto,
      });
    } catch (error) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.item.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
  }
} 
