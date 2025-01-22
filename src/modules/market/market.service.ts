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
2025.01.20  이유민      Modified    요청 반려 관련 API 추가
2025.01.21  이유민      Modified    에코마켓 신청 철회 API 추가
2025.01.22  이유민      Modified    마켓명 확인 코드 추가
*/
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Market, Rejection } from 'src/modules/market/market.entity';
import { MarketRepository } from 'src/modules/market/repository/market.repository';
import { RejectionRepository } from 'src/modules/market/repository/rejection.repository';

@Injectable()
export class MarketService {
  constructor(
    private readonly marketRepository: MarketRepository,
    private readonly rejectionRepository: RejectionRepository,
  ) {}

  // 에코마켓 생성
  async createMarket(marketData: Partial<Market>): Promise<Market> {
    const nameCheck = await this.marketRepository.findMarketByName(
      marketData.market_name,
    );

    if (nameCheck)
      throw new ConflictException(
        '이미 존재하는 마켓명입니다. 다른 이름을 사용해주세요.',
      );

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
  async updateIsVerified(id: number, is_verified: string): Promise<object> {
    return this.marketRepository.updateIsVerified(id, is_verified);
  }

  // 에코마켓 재심사
  async retryMarket(id: number, updateData: Partial<Market>): Promise<object> {
    const nameCheck = await this.marketRepository.findMarketByName(
      updateData.market_name,
    );

    if (nameCheck && nameCheck.id !== id)
      throw new ConflictException(
        '이미 존재하는 마켓명입니다. 다른 이름을 사용해주세요.',
      );

    await this.marketRepository.updateMarketInfo(id, updateData);

    return { message: '재심사 요청되었습니다.' };
  }

  // 에코마켓 정보 수정
  async updateMarketInfo(
    user_id: number,
    id: number,
    updateData: Partial<Market>,
  ): Promise<object> {
    const market = await this.marketRepository.findMarketById(id);

    if (user_id !== market.user_id)
      throw new UnauthorizedException('권한이 없습니다.');

    if (market.market_name !== updateData.market_name) {
      const nameCheck = await this.marketRepository.findMarketByName(
        updateData.market_name,
      );

      if (nameCheck)
        throw new ConflictException(
          '이미 존재하는 마켓명입니다. 다른 이름을 사용해주세요.',
        );
    }

    return await this.marketRepository.updateMarketInfo(id, updateData);
  }

  // 에코마켓 삭제 요청
  async deleteRequestMarket(user_id: number, id: number): Promise<object> {
    return this.marketRepository.deleteRequestMarket(user_id, id);
  }

  // 에코마켓 삭제
  async deleteMarketById(
    id: number,
    is_deletion_requested: string,
  ): Promise<object> {
    return this.marketRepository.deleteMarketById(id, is_deletion_requested);
  }

  async writeRejectionReason(
    market_id: number,
    reason: string,
  ): Promise<object> {
    const findData =
      await this.rejectionRepository.findRejectionByMarketId(market_id);

    if (!findData) {
      await this.rejectionRepository.createRejection({
        market_id,
        reason,
      });
    } else {
      await this.rejectionRepository.updateRejection(findData.id, {
        reason,
        visibility: true,
      });
    }

    return { message: '반려 이유가 작성되었습니다.' };
  }

  async readRejectionReason(market_id: number): Promise<Rejection> {
    return await this.rejectionRepository.findRejectionByMarketId(market_id);
  }

  async changeVisibility(rejection_id: number): Promise<object> {
    await this.rejectionRepository.updateRejection(rejection_id, {
      visibility: false,
    });

    return { message: '반려 사유를 숨겼습니다.' };
  }

  async deleteRejectedMarket(
    market_id: number,
    user_id: number,
  ): Promise<object> {
    const market = await this.marketRepository.findMyMarketById(
      market_id,
      user_id,
    );

    if (market.length === 0 || market[0]['market_is_verified'] !== 'rejected')
      throw new NotFoundException('리소스를 찾을 수 없습니다.');

    await this.marketRepository.deleteMarketById(market_id, 'approved');

    return { message: '신청 마켓이 삭제되었습니다.' };
  }
}
