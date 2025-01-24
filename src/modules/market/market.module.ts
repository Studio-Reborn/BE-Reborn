/**
File Name : market.module
Description : 에코마켓 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.21  이유민      Created     
2024.11.21  이유민      Modified    에코마켓 추가
2025.01.19  이유민      Modified    모듈 코드 리팩토링
2025.01.20  이유민      Modified    요청 반려 관련 API 추가
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market, Rejection } from 'src/modules/market/market.entity';
import { MarketRepository } from 'src/modules/market/repository/market.repository';
import { MarketService } from 'src/modules/market/market.service';
import { MarketController } from 'src/modules/market/market.controller';
import { RejectionRepository } from 'src/modules/market/repository/rejection.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Market, Rejection])],
  providers: [MarketRepository, MarketService, RejectionRepository],
  controllers: [MarketController],
  exports: [MarketRepository, RejectionRepository],
})
export class MarketModule {}
