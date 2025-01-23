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
2024.12.17  이유민      Modified    코드 리팩토링
2025.01.02  이유민      Modified    검색 및 정렬 추가
2025.01.18  이유민      Modified    내 마켓 관련 API 추가
2025.01.21  이유민      Modified    에코마켓 신청 철회 API 추가
2025.01.22  이유민      Modified    마켓명 확인 코드 추가
2025.01.23  이유민      Modified    에코마켓 관련 페이지네이션 추가
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
  async findMarketAll(
    sort?: string,
    search?: string,
    page?: number,
  ): Promise<{
    data: Market[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    // 정렬 관련
    let sortName = '';
    switch (sort) {
      case 'name':
        sortName = 'market.market_name';
        break;
      case 'latest':
        sortName = 'market.created_at';
        break;
      case 'likes':
        sortName = 'market_likes';
        break;
      default:
        sortName = 'market_likes';
    }

    // 페이지네이션 관련
    const limit = 6;
    const skip = (page - 1) * limit;

    const markets = await this.marketRepository.query(`
      SELECT market.id AS id ,
         market.created_at AS created_at ,
         market.updated_at AS updated_at ,
         market.deleted_at AS deleted_at ,
         market.is_deletion_requested AS is_deletion_requested ,
         market.is_verified AS is_verified ,
         market.market_detail AS market_detail ,
         market.market_name AS market_name ,
         market.profile_image_id AS profile_image_id ,
         profile.url AS profile_image_url,
         COALESCE((SELECT COUNT(*)
          FROM market_like
          WHERE market_like.market_id = market.id AND market_like.deleted_at IS NULL
          GROUP BY market_like.market_id), 0) AS market_likes
      FROM market market
      LEFT JOIN profile_image profile ON market.profile_image_id = profile.id
      WHERE market.is_verified = "approved"
        AND market.deleted_at IS NULL
        AND (market.is_deletion_requested IS NULL OR market.is_deletion_requested = "rejected")
        ${search ? `AND (market.market_name LIKE "%${search}%" OR market.market_detail LIKE "%${search}%")` : ''}
      ORDER BY ${sortName} ${sort === 'name' ? 'ASC' : 'DESC'}
      LIMIT ${limit} OFFSET ${skip};
      `);

    const total = await this.marketRepository
      .createQueryBuilder('market')
      .where(
        'market.is_verified = "approved" AND market.deleted_at IS NULL AND (market.is_deletion_requested IS NULL OR market.is_deletion_requested = "rejected")',
      )
      .getCount();

    return {
      data: markets, // 현재 페이지의 데이터
      total, // 전체 데이터 개수
      currentPage: page, // 현재 페이지 번호
      totalPages: Math.ceil(total / limit), // 전체 페이지 수
    };
  }

  async findMarketByName(name: string): Promise<Market> {
    return await this.marketRepository
      .createQueryBuilder('market')
      .where('market.market_name = :name', { name })
      .getOne();
  }

  // id로 에코마켓 개별 조회
  async findMarketById(id: number): Promise<Market> {
    const market = await this.marketRepository
      .createQueryBuilder('market')
      .where(
        'market.id = :id AND market.is_verified = "approved" AND market.deleted_at IS NULL AND (market.is_deletion_requested IS NULL OR market.is_deletion_requested = "rejected")',
        { id },
      )
      .getOne();

    if (!market) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    return market;
  }

  // 본인의 에코마켓 전체 조회
  async findMarketByUserId(user_id: number): Promise<Market[]> {
    return await this.marketRepository
      .createQueryBuilder('market')
      .select([
        'market.id AS market_id',
        'market.market_name AS market_name',
        'market.is_verified AS market_is_verified',
        'market.is_deletion_requested AS market_is_deletion',
      ])
      .addSelect(
        // 판매 제품 수
        (subQuery) =>
          subQuery
            .select('COUNT(product.id)')
            .from('market_product', 'product')
            .where(
              'product.market_id = market.id AND product.deleted_at IS NULL',
            ),
        'product_count',
      )
      .addSelect(
        // 배송 전 제품 수
        (subQuery) =>
          subQuery
            .select('COUNT(items.id)')
            .from('order_items', 'items')
            .leftJoin(
              'market_product',
              'product',
              'product.id = items.product_id',
            )
            .where(
              'product.market_id = market.id AND items.status = "결제완료"',
            ),
        'before_delivery_count',
      )
      .where('market.user_id = :user_id AND market.deleted_at IS NULL', {
        user_id,
      })
      .getRawMany();
  }

  // 본인의 에코마켓 상세 조회
  async findMyMarketById(id: number, user_id: number): Promise<Market[]> {
    return await this.marketRepository
      .createQueryBuilder('market')
      .leftJoin('market_product', 'product', 'market.id = product.market_id')
      .leftJoin('order_items', 'items', 'product.id = items.product_id')
      .leftJoin('orders', 'orders', 'items.order_id = orders.id')
      .leftJoin(
        'profile_image',
        'profile',
        'market.profile_image_id = profile.id',
      )
      .select([
        'product.id AS product_id',
        'product.name AS product_name',
        'items.id AS items_id',
        'items.price AS items_price',
        'items.quantity AS items_quantity',
        'orders.id AS orders_id',
        'orders.postcode AS orders_postcode',
        'orders.address AS orders_address',
        'orders.detail_address AS orders_detail_address',
        'orders.extra_address AS orders_extra_address',
        'orders.name AS user_name',
        'orders.phone AS user_phone',
        'items.status AS items_status',
        'items.tracking_number AS items_tracking_number',
        'market.market_name AS market_name',
        'market.is_verified AS market_is_verified',
        'market.is_deletion_requested AS market_is_deletion',
        'market.market_detail AS market_detail',
        'profile.url AS market_profile_url',
        'profile.id AS market_profile_id',
      ])
      .where(
        'market.id = :id AND market.user_id = :user_id AND market.deleted_at IS NULL',
        { id, user_id },
      )
      .getRawMany();
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
        'market.is_verified = "pending" AND market.deleted_at IS NULL AND market.is_deletion_requested IS NULL',
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
        'market.is_verified = "approved" AND market.deleted_at IS NULL AND market.is_deletion_requested = "pending"',
      )
      .getRawMany();
  }

  // 에코마켓 신청 확인
  async updateIsVerified(id: number, is_verified: string): Promise<object> {
    const market = await this.marketRepository
      .createQueryBuilder('market')
      .where(
        'market.id = :id AND market.is_verified = "pending" AND market.deleted_at IS NULL AND market.is_deletion_requested IS NULL',
        { id },
      )
      .getOne();

    if (!market) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    await this.marketRepository.update(id, { is_verified });

    return { message: '요청된 마켓을 확인했습니다.' };
  }

  // 에코마켓 정보 수정
  async updateMarketInfo(
    id: number,
    updateData: Partial<Market>,
  ): Promise<object> {
    await this.marketRepository.update(id, updateData);

    return { message: '마켓 정보가 성공적으로 변경되었습니다.' };
  }

  // 에코마켓 삭제 요청
  async deleteRequestMarket(user_id: number, id: number): Promise<object> {
    const market = await this.findMarketById(id);

    if (user_id !== market.user_id)
      throw new UnauthorizedException('권한이 없습니다.');

    Object.assign(market, { is_deletion_requested: 'pending' });
    await this.marketRepository.save(market);

    return { message: '마켓 삭제 요청이 성공적으로 전송되었습니다.' };
  }

  // 관리자 에코마켓 삭제 승인 또는 반려
  async deleteMarketById(
    id: number,
    is_deletion_requested: string,
  ): Promise<object> {
    const market = await this.marketRepository
      .createQueryBuilder('market')
      .where('market.id = :id AND market.deleted_at IS NULL', { id })
      .getOne();

    if (!market) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    await this.marketRepository.update(id, { is_deletion_requested });

    if (is_deletion_requested === 'approved')
      await this.marketRepository.update(id, { deleted_at: new Date() });

    return { message: '에코마켓 삭제 요청을 확인했습니다.' };
  }
}
