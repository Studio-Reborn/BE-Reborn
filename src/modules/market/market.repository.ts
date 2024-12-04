/**
File Name : market.repository
Description : 에코마켓 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.21  이유민      Created     
2024.11.21  이유민      Modified    에코마켓 추가
2024.12.04  이유민      Modified    에코마켓 삭제(관리자) 기능 추가
2024.12.04  이유민      Modified    생성 및 삭제 요청 조회 기능 추가
*/

import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Market } from 'src/modules/market/market.entity';

@Injectable()
export class MarketRepository {
  constructor(
    @InjectRepository(Market)
    private readonly marketRepository: Repository<Market>,
  ) {}

  // 에코마켓 생성
  async createMarket(marketData: Partial<Market>): Promise<Market> {
    const market = this.marketRepository.create(marketData);
    return await this.marketRepository.save(market);
  }

  // 에코마켓 전체 조회
  async findMarketAll(): Promise<Market[]> {
    return await this.marketRepository
      .createQueryBuilder('market')
      .where(
        'market.is_verified = true AND market.deleted_at IS NULL AND market.is_deletion_requested = false',
      )
      .getMany();
  }

  // id로 에코마켓 개별 조회
  async findMarketById(id: number): Promise<Market> {
    const market = await this.marketRepository
      .createQueryBuilder('market')
      .where(
        'market.id = :id AND market.is_verified = true AND market.deleted_at IS NULL AND market.is_deletion_requested = false',
        { id },
      )
      .getOne();

    if (!market) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    return market;
  }

  // 새로 신청한 에코마켓 조회
  async findCreateMarket(): Promise<Market[]> {
    return await this.marketRepository
      .createQueryBuilder('market')
      .leftJoin(
        'profile_image',
        'profile',
        'market.profile_image_id = profile.id',
      )
      .leftJoin('users', 'users', 'market.user_id = users.id')
      .select([
        'market.id AS market_id',
        'market.user_id',
        'market.market_name AS market_name',
        'market.market_detail AS market_detail',
        'market.created_at AS market_created_at',
        'profile.url AS market_profile_image',
        'users.nickname AS user_nickname',
        'users.email AS user_email',
      ])
      .where(
        'market.is_verified = false AND market.deleted_at IS NULL AND market.is_deletion_requested = false',
      )
      .getRawMany();
  }

  // 삭제 요청한 에코마켓 조회
  async findDeleteMarket(): Promise<Market[]> {
    return await this.marketRepository
      .createQueryBuilder('market')
      .leftJoin(
        'profile_image',
        'profile',
        'market.profile_image_id = profile.id',
      )
      .leftJoin('users', 'users', 'market.user_id = users.id')
      .select([
        'market.id AS market_id',
        'market.user_id',
        'market.market_name AS market_name',
        'market.market_detail AS market_detail',
        'market.created_at AS market_created_at',
        'profile.url AS market_profile_image',
        'users.nickname AS user_nickname',
        'users.email AS user_email',
      ])
      .where(
        'market.is_verified = true AND market.deleted_at IS NULL AND market.is_deletion_requested = true',
      )
      .getRawMany();
  }

  // 에코마켓 신청 확인
  async checkCreateMarket(id: number): Promise<object> {
    const market = await this.marketRepository
      .createQueryBuilder('market')
      .where(
        'market.id = :id AND market.is_verified = false AND market.deleted_at IS NULL AND market.is_deletion_requested = false',
        { id },
      )
      .getOne();

    if (!market) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    Object.assign(market, { is_verified: true });
    await this.marketRepository.save(market);

    return { message: '요청된 마켓을 성공적으로 생성했습니다.' };
  }

  // 에코마켓 정보 수정
  async updateMarketInfo(
    user_id: number,
    id: number,
    updateData: Partial<Market>,
  ): Promise<object> {
    const market = await this.findMarketById(id);

    if (user_id !== market.user_id)
      throw new UnauthorizedException('권한이 없습니다.');

    Object.assign(market, updateData);
    await this.marketRepository.save(market);

    return { message: '마켓 정보가 성공적으로 변경되었습니다.' };
  }

  // 에코마켓 삭제 요청
  async deleteRequestMarket(user_id: number, id: number): Promise<object> {
    const market = await this.findMarketById(id);

    if (user_id !== market.user_id)
      throw new UnauthorizedException('권한이 없습니다.');

    Object.assign(market, { is_deletion_requested: true });
    await this.marketRepository.save(market);

    return { message: '마켓 삭제 요청이 성공적으로 전송되었습니다.' };
  }

  // 에코마켓 삭제
  async deleteMarketById(id: number): Promise<object> {
    const market = await this.marketRepository
      .createQueryBuilder('market')
      .where(
        'market.id = :id AND market.deleted_at IS NULL AND market.is_deletion_requested = true',
        { id },
      )
      .getOne();

    if (!market) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    market.deleted_at = new Date();
    await this.marketRepository.save(market);

    return { message: '리메이크 제품이 성공적으로 삭제되었습니다.' };
  }
}
