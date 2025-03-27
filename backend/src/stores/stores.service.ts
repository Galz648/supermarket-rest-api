import { Injectable, } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class StoresService {
    constructor(private prisma: PrismaService) { }

    async findAll(city: string, chainName: string) {
        return this.prisma.store.findMany({
            where: {
                address: {
                    contains: city,
                    mode: 'insensitive'
                },
                chainName: chainName,
            },
            include: {
                chain: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    }

    async findByChain(chainName: string) {
        return this.prisma.store.findMany({
            where: {
                chainName,
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
                address: {
                    contains: city,
                    mode: 'insensitive'
                },
                chainName: chainName,
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
