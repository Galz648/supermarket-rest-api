import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class StoresService {
    constructor(private prisma: PrismaService) { }

    async findAll(cities?: string[], chains?: string[]) {
        const where: Prisma.StoreWhereInput = {};

        if (cities && cities.length > 0) {
            where.city = {
                in: cities,
                mode: 'insensitive'
            };
        }

        if (chains && chains.length > 0) {
            where.chainName = {
                in: chains,
                mode: 'insensitive'
            };
        }

        return this.prisma.store.findMany({
            where,
            include: {
                chain: true
            }
        });
    }

    async findByChain(chainName: string) {
        return this.prisma.store.findMany({
            where: {
                chainName: {
                    contains: chainName,
                    mode: 'insensitive'
                }
            },
            include: {
                chain: true
            },
            orderBy: {
                name: 'asc'
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

    async getAllCities() {
        const stores = await this.prisma.store.findMany({
            select: {
                city: true
            },
            distinct: ['city']
        });

        return stores.map(store => store.city);
    }
}
