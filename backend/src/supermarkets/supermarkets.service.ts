import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSupermarketDto } from './dto/create-supermarket.dto';
import { UpdateSupermarketDto } from './dto/update-supermarket.dto';

@Injectable()
export class SupermarketsService {
  constructor(private prisma: PrismaService) {}

  async create(createSupermarketDto: CreateSupermarketDto) {
    const { ...supermarketData } = createSupermarketDto;
    
    // Create the supermarket
    const supermarket = await this.prisma.supermarket.create({
      data: {
        ...supermarketData,
      },
    });
    return this.findOne(supermarket.id);
  }

  async findAll() {
    return this.prisma.supermarket.findMany({
      include: {
        operatingHours: true,
      },
    });
  }

  async findOne(id: string) {
    const supermarket = await this.prisma.supermarket.findUnique({
      where: { id },
      include: {
        operatingHours: true,
      },
    });

    if (!supermarket) {
      throw new NotFoundException(`Supermarket with ID ${id} not found`);
    }

    return supermarket;
  }

  // async findNearby({ lat, lng, radius }: FindNearbyDto) {
  //   // For MongoDB, we would use the $near operator
  //   // This is a simplified version that doesn't use geospatial queries yet
  //   const supermarkets = await this.prisma.supermarket.findMany({
  //     include: {
  //       operatingHours: true,
  //     },
  //   });

  //   // Calculate distance using Haversine formula
  //   const nearby = supermarkets.map(supermarket => {
  //     const distance = this.calculateDistance(
  //       lat, 
  //       lng, 
  //       supermarket.latitude, 
  //       supermarket.longitude
  //     );
  //     return { ...supermarket, distance };
  //   })
  //   .filter(s => s.distance <= radius)
  //   .sort((a, b) => a.distance - b.distance);

  //   return nearby;
  // }

  async update(id: string, updateSupermarketDto: UpdateSupermarketDto) {
    // Check if supermarket exists
    await this.findOne(id);

    const { coordinates, operatingHours, ...supermarketData } = updateSupermarketDto;

    // Update supermarket data
    await this.prisma.supermarket.update({
      where: { id },
      data: {
        ...supermarketData,
        ...(coordinates && {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }),
      },
    });

    // Update operating hours if provided
    if (operatingHours) {
      // Delete existing hours
      await this.prisma.operatingHours.deleteMany({
        where: { supermarketId: id },
      });

      // Create new hours
      const operatingHoursData = Object.entries(operatingHours).map(([day, hours]) => ({
        supermarketId: id,
        dayOfWeek: parseInt(day),
        openTime: hours.open,
        closeTime: hours.close,
      }));

      await this.prisma.operatingHours.createMany({
        data: operatingHoursData,
      });
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    // Check if supermarket exists
    await this.findOne(id);

    // Delete the supermarket (cascade will handle related records)
    return this.prisma.supermarket.delete({
      where: { id },
    });
  }

  // Helper method to calculate distance between two points using Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
} 
