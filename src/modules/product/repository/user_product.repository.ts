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
2025.01.08  이유민      Modified    판매중인 제품만 보기 추가
2025.01.09  이유민      Modified    사용자의 전체 제품 조회 시 검색, 정렬 및 판매중인 제품만 보기 추가
2025.01.19  이유민      Modified    회원 탈퇴 추가
2025.01.22  이유민      Modified    페이지네이션 추가
2025.01.23  이유민      Modified    중고거래 사용자 검색 페이지네이션 추가
2025.01.25  이유민      Modified    이미지 url 관련 오류 수정
2025.01.31  이유민      Modified    이미지 url 관련 오류 수정
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
  async findProductAll(
    sort: string,
    search?: string,
    status?: string,
    page?: number,
  ): Promise<{
    products: UserProduct[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    const query = this.userProductRepository
      .createQueryBuilder('product')
      .where('product.deleted_at IS NULL');

    if (search)
      query.andWhere(
        '(product.name LIKE :search OR product.detail LIKE :search)',
        { search: `%${search}%` },
      );

    if (status === 'true') query.andWhere('product.status = "판매중"');

    query.orderBy(
      sort === 'name' // name일 경우
        ? 'product.name' // 이름순
        : sort === 'latest' // latest일 경우
          ? 'product.created_at' // 최신순
          : 'product.created_at', // 기본은 최신순
      sort === 'name' ? 'ASC' : 'DESC',
    );

    // 페이지네이션
    const limit = 9; // 한 페이지에 가져올 데이터 수
    const skip = (page - 1) * limit; // 가져올 시작 위치

    query.skip(skip).take(limit);

    const [products, total] = await query.getManyAndCount();
    return {
      products, // 현재 페이지의 데이터
      total, // 전체 데이터 개수
      currentPage: page, // 현재 페이지 번호
      totalPages: Math.ceil(total / limit), // 전체 페이지 수
    };
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
  async findProductByUserId(
    user_id: number,
    search?: string,
    sort?: string,
    status?: string,
    page?: number,
  ): Promise<{
    data: UserProduct[];
    total: number;
    currentPage: number;
    totalPages: number;
  }> {
    // 페이지네이션 관련
    const limit = 9;
    const skip = (page - 1) * limit;

    const products = await this.userProductRepository.query(`
      SELECT product.id AS product_id ,
         product.created_at AS product_created_at ,
         product.name AS product_name ,
         product.detail AS product_detail ,
         product.price AS product_price ,
         product.status AS product_status ,
         image.url AS product_image ,
         COUNT(product_like.id) AS product_like_cnt
      FROM user_product product
      LEFT JOIN product_image image ON product.product_image_id = image.id
      LEFT JOIN product_like product_like ON product.id = product_like.product_id
      WHERE product.user_id = ${user_id} AND product.deleted_at IS NULL AND product_like.deleted_at IS NULL
        ${search ? `AND (product.name LIKE '%${search}%' OR product.detail LIKE '%${search}%')` : ''}
        ${status === 'true' ? `AND product.status = "판매중"` : ''}
      GROUP BY product.id
      ORDER BY ${sort === 'name' ? 'product.name ASC' : 'product.created_at DESC'}
      LIMIT ${limit} OFFSET ${skip};
      `);

    products.forEach((product) => {
      if (product.product_image) {
        product.product_image = JSON.parse(product.product_image);
      }
    });

    const total = await this.userProductRepository
      .createQueryBuilder('product')
      .where('product.user_id = :user_id AND product.deleted_at IS NULL', {
        user_id,
      })
      .getCount();

    return {
      data: products, // 현재 페이지의 데이터
      total, // 전체 데이터 개수
      currentPage: page, // 현재 페이지 번호
      totalPages: Math.ceil(total / limit), // 전체 페이지 수
    };
  }

  // 중고물품 구매 내역 조회
  async findProductByBuyerUserId(user_id: number): Promise<UserProduct[]> {
    const data = await this.userProductRepository
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

    data.forEach((data) => {
      if (data.product_image) {
        data.product_image = JSON.parse(data.product_image);
      }
    });

    return data;
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

  // 유저의 모든 중고거래 제품 삭제
  async deleteProductByUserId(user_id: number): Promise<object> {
    await this.userProductRepository.update(user_id, {
      deleted_at: new Date(),
    });

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
