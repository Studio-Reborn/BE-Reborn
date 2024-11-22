/**
File Name : market.module
Description : 에코마켓 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.21  이유민      Created     
2024.11.21  이유민      Modified    에코마켓 추가
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from 'src/modules/market/market.entity';
import { MarketRepository } from 'src/modules/market/market.repository';
import { MarketService } from 'src/modules/market/market.service';
import { MarketController } from 'src/modules/market/market.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Market])],
  providers: [MarketRepository, MarketService],
  controllers: [MarketController],
})
export class MarketModule {}
