/**
File Name : market.service
Description : 에코마켓 Service
Author : 이유민

History
Date        Author      Status      Description
2024.11.21  이유민      Created     
2024.11.21  이유민      Modified    에코마켓 추가
*/
import { Injectable } from '@nestjs/common';
import { Market } from 'src/modules/market/market.entity';
import { MarketRepository } from 'src/modules/market/market.repository';

@Injectable()
export class MarketService {
  constructor(private readonly marketRepository: MarketRepository) {}

  async createMarket(marketData: Partial<Market>): Promise<Market> {
    return this.marketRepository.createMarket(marketData);
  }
}
