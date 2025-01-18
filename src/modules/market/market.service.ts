/**
File Name : market.service
Description : 에코마켓 Service
Author : 이유민

History
Date        Author      Status      Description
2024.11.21  이유민      Created     
2024.11.21  이유민      Modified    에코마켓 추가
2024.12.04  이유민      Modified    에코마켓 삭제(관리자) 기능 추가
2024.12.04  이유민      Modified    생성 및 삭제 요청 조회 기능 추가
2025.01.02  이유민      Modified    검색 및 정렬 추가
2025.01.18  이유민      Modified    내 마켓 관련 API 추가
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
  async findMarketAll(sort?: string, search?: string): Promise<Market[]> {
    return this.marketRepository.findMarketAll(sort, search);
  }

  // id로 에코마켓 개별 조회
  async findMarketById(id: number): Promise<Market> {
    return this.marketRepository.findMarketById(id);
  }

  async findMarketByUserId(user_id: number): Promise<Market[]> {
    return await this.marketRepository.findMarketByUserId(user_id);
  }
  // 본인의 에코마켓 상세 조회
  async findMyMarketById(id: number, user_id: number): Promise<Market[]> {
    return await this.marketRepository.findMyMarketById(id, user_id);
  }

  // 새로 신청한 에코마켓 조회
  async findCreateMarket(): Promise<Market[]> {
    return this.marketRepository.findCreateMarket();
  }

  // 새로 신청한 에코마켓 조회
  async findDeleteMarket(): Promise<Market[]> {
    return this.marketRepository.findDeleteMarket();
  }

  // 에코마켓 신청 확인
  async checkCreateMarket(id: number): Promise<object> {
    return this.marketRepository.checkCreateMarket(id);
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

  // 에코마켓 삭제
  async deleteMarketById(id: number): Promise<object> {
    return this.marketRepository.deleteMarketById(id);
  }
}
