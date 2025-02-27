import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SupermarketsModule } from './supermarkets/supermarkets.module';
import { ItemsModule } from './items/items.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        SupermarketsModule,
        ItemsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { } 
