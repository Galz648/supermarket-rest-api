import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class StoresService {
    constructor(private prisma: PrismaService) { }

    async findAll(city?: string, chain?: string) {
        const where: Prisma.StoreWhereInput = {};

        if (city) {
            where.city = city;
        }

        if (chain) {
            where.chain = {
                name: chain
            };
        }

        return this.prisma.store.findMany({
            where,
            include: {
                chain: true
            }
        });
    }

    async findOne(id: string) {
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
        const stores = await this.prisma.store.findMany({
            select: {
                city: true
            },
            distinct: ['city']
        });

        return stores.map(store => store.city);
    }

    async findByChain(chainName: string) {
        return this.prisma.store.findMany({
            where: {
                chain: {
                    name: chainName
                }
            },
            include: {
                chain: true,
            },
            orderBy: {
                name: 'asc',
            },
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

    async findByCity(city: string, chainName: string) {
        return this.prisma.store.findMany({
            where: {
                city: city,
                chain: {
                    name: chainName
                }
            },
            include: {
                chain: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
}
