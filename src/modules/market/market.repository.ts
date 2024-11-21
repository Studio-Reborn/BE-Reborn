/**
File Name : market.repository
Description : 에코마켓 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.21  이유민      Created     
2024.11.21  이유민      Modified    에코마켓 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Market } from 'src/modules/market/market.entity';

@Injectable()
export class MarketRepository {
  constructor(
    @InjectRepository(Market)
    private readonly marketRepository: Repository<Market>,
  ) {}

  async createMarket(marketData: Partial<Market>): Promise<Market> {
    const market = this.marketRepository.create(marketData);
    return await this.marketRepository.save(market);
  }
}
