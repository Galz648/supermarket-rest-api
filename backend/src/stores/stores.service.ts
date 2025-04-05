import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import { ObjectId } from 'mongodb';

@Injectable()
export class StoresService {
    constructor(private prisma: PrismaService) { }

    async findAll(city?: string, chainObjectId?: string) {
        const where: Prisma.StoreWhereInput = {};

        if (city) {
            where.city = city;
        }

        if (chainObjectId) {
            if (!ObjectId.isValid(chainObjectId)) {
                throw new BadRequestException(`Invalid chain ObjectId: ${chainObjectId}`);
            }
            where.chainObjectId = chainObjectId;
        }

        return this.prisma.store.findMany({
            where,
            include: {
                chain: true
            }
        });
    }

    async findOne(id: string) {
        if (!ObjectId.isValid(id)) {
            throw new BadRequestException(`Invalid store ObjectId: ${id}`);
        }

        return this.prisma.store.findUnique({
            where: { id },
            include: {
                chain: true
            }
        });
    }

    async getAllChains() {
        return this.prisma.chain.findMany({
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        stores: true
                    }
                }
            }
        });
    }

    async getAllCities() {
        return this.prisma.store.findMany({
            select: {
                city: true
            },
            distinct: ['city']
        });
    }

    async findByChain(chainObjectId: string) {
        if (!ObjectId.isValid(chainObjectId)) {
            throw new BadRequestException(`Invalid chain ObjectId: ${chainObjectId}`);
        }

        return this.prisma.store.findMany({
            where: {
                chainObjectId
            },
            include: {
                chain: true
            }
        });
    }

    // async getStoreItemPrices(storeId: string) {
    //     const store = await this.prisma.store.findUnique({
    //         where: { storeId },
    //     });

    //     if (!store) {
    //         throw new NotFoundException(`Store with ID ${storeId} not found`);
    //     }

    //     return this.prisma.itemPrice.findMany({
    //         where: {
    //             storeId: store.storeId,
    //             chainName: store.chainName,
    //         },
    //         include: {
    //             item: true,
    //         },
    //         orderBy: {
    //             timestamp: 'desc',
    //         },
    //     });
    // }

    async findByCity(city: string, chainObjectId: string) {
        if (!ObjectId.isValid(chainObjectId)) {
            throw new BadRequestException(`Invalid chain ObjectId: ${chainObjectId}`);
        }

        return this.prisma.store.findMany({
            where: {
                city,
                chainObjectId
            },
            include: {
                chain: true
            }
        });
    }
}
