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

  // 에코마켓 생성
  async createMarket(marketData: Partial<Market>): Promise<Market> {
    return this.marketRepository.createMarket(marketData);
  }

  // 에코마켓 전체 조회
  async findMarketAll(): Promise<Market[]> {
    return this.marketRepository.findMarketAll();
  }

  // id로 에코마켓 개별 조회
  async findMarketById(id: number): Promise<Market> {
    return this.marketRepository.findMarketById(id);
  }

  // 에코마켓 정보 수정
  async updateMarketInfo(
    user_id: number,
    id: number,
    updateData: Partial<Market>,
  ): Promise<object> {
    return this.marketRepository.updateMarketInfo(user_id, id, updateData);
  }

  // 에코마켓 삭제 요청
  async deleteRequestMarket(user_id: number, id: number): Promise<object> {
    return this.marketRepository.deleteRequestMarket(user_id, id);
  }
}
