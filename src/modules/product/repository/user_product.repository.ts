/**
File Name : user_product.repository
Description : 중고거래 상품 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.26  이유민      Created     
2024.11.26  이유민      Modified    상품 테이블 분리
2024.12.04  이유민      Modified    코드 리팩토링
2024.12.17  이유민      Modified    product_id 타입 수정
2024.12.30  이유민      Modified    중고거래 판매 완료 추가
2024.12.30  이유민      Modified    중고거래 구매내역 조회 추가
2024.12.30  이유민      Modified    중고거래 횟수 조회 추가
2025.01.02  이유민      Modified    검색 및 정렬 추가
*/
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserProduct } from 'src/modules/product/entity/user_product.entity';

@Injectable()
export class UserProductRepository {
  constructor(
    @InjectRepository(UserProduct)
    private readonly userProductRepository: Repository<UserProduct>,
  ) {}

  // 중고거래 제품 생성
  async createProduct(ProductData: Partial<UserProduct>): Promise<UserProduct> {
    const product = this.userProductRepository.create(ProductData);
    return await this.userProductRepository.save(product);
  }

  // 중고거래 제품 전체 조회
  async findProductAll(sort: string, search?: string): Promise<UserProduct[]> {
    const product = await this.userProductRepository
      .createQueryBuilder('product')
      .where('product.deleted_at IS NULL')
      .andWhere(
        search
          ? 'product.name LIKE :search OR product.detail LIKE :search'
          : '1=1',
        { search: `%${search}%` },
      )
      .orderBy(
        sort === 'name' // name일 경우
          ? 'product.name' // 이름순
          : sort === 'latest' // latest일 경우
            ? 'product.created_at' // 최신순
            : 'product.created_at', // 기본은 최신순
        sort === 'name' ? 'ASC' : 'DESC',
      )
      .getMany();

    return product;
  }

  // id로 중고거래 제품 개별 조회
  async findProductById(id: string): Promise<UserProduct> {
    const product = await this.userProductRepository
      .createQueryBuilder('product')
      .where('product.id = :id AND product.deleted_at IS NULL', { id })
      .getOne();

    if (!product) throw new NotFoundException('상품을 찾을 수 없습니다.');

    return product;
  }

  // user_id로 중고거래 제품 조회
  async findProductByUserId(user_id: number): Promise<UserProduct[]> {
    return await this.userProductRepository
      .createQueryBuilder('product')
      .leftJoin('product_image', 'image', 'product.product_image_id = image.id')
      .select([
        'product.id AS product_id',
        'product.created_at AS product_created_at',
        'product.name AS product_name',
        'product.detail AS product_detail',
        'product.price AS product_price',
        'product.status AS product_status',
        'image.url AS product_image',
      ])
      .where('product.user_id = :user_id AND product.deleted_at IS NULL', {
        user_id,
      })
      .orderBy('product.created_at', 'DESC')
      .getRawMany();
  }

  // 중고물품 구매 내역 조회
  async findProductByBuyerUserId(user_id: number): Promise<UserProduct[]> {
    return await this.userProductRepository
      .createQueryBuilder('product')
      .leftJoin('product_image', 'image', 'product.product_image_id = image.id')
      .leftJoin('users', 'users', 'product.user_id = users.id')
      .select([
        'product.id AS product_id',
        'product.created_at AS product_created_at',
        'product.name AS product_name',
        'product.detail AS product_detail',
        'product.price AS product_price',
        'product.status AS product_status',
        'image.url AS product_image',
        'users.nickname AS seller_nickname',
      ])
      .where(
        'product.buyer_user_id = :user_id AND product.deleted_at IS NULL',
        {
          user_id,
        },
      )
      .orderBy('product.updated_at', 'DESC')
      .getRawMany();
  }

  // 중고거래 거래 완료
  async soldOutUserProduct(
    user_id: number,
    id: string,
    buyer_user_id: number,
  ): Promise<object> {
    const product = await this.findProductById(id);

    if (user_id !== product.user_id)
      throw new UnauthorizedException('접근할 수 없습니다.');

    Object.assign(product, { buyer_user_id });
    await this.userProductRepository.save(product);

    return { message: '거래가 성공적으로 완료되었습니다.' };
  }

  // id로 중고거래 제품 수정
  async updateProductById(
    id: string,
    updateData: Partial<UserProduct>,
  ): Promise<object> {
    const product = await this.findProductById(id);

    Object.assign(product, updateData);
    await this.userProductRepository.save(product);

    return { message: '성공적으로 변경되었습니다.' };
  }

  // id로 중고거래 제품 삭제
  async deleteProductById(id: string): Promise<object> {
    const product = await this.findProductById(id);

    product.deleted_at = new Date();
    await this.userProductRepository.save(product);

    return { message: '성공적으로 삭제되었습니다.' };
  }

  // 중고거래 판매 횟수 조회
  async readUserProductCnt(): Promise<{ preLovedCnt: string }> {
    return await this.userProductRepository
      .createQueryBuilder('preLoved')
      .select('COUNT(*) AS preLovedCnt')
      .where('preLoved.buyer_user_id IS NOT NULL')
      .getRawOne();
  }
}
