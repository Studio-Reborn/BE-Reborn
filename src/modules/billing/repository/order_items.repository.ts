/**
File Name : order_items.repository
Description : 주문 제품 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.26  이유민      Created     
2024.11.26  이유민      Modified    주문 제품 추가
2024.12.30  이유민      Modified    리본 리메이크 제품 판매 횟수 조회 추가
2025.01.18  이유민      Modified    내 마켓 관련 API 추가
2025.01.18  이유민      Modified    리본 리메이크 판매 내역 추가
*/
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItems } from 'src/modules/billing/entity/order_items.entity';

@Injectable()
export class OrderItemsRepository {
  constructor(
    @InjectRepository(OrderItems)
    private readonly orderItemsRepository: Repository<OrderItems>,
  ) {}

  // 주문 제품 생성
  async createOrderItems(
    orderItemsData: Partial<OrderItems>[],
  ): Promise<OrderItems[]> {
    return await this.orderItemsRepository.save(orderItemsData);
  }

  async findItemById(id: number): Promise<OrderItems> {
    const item = await this.orderItemsRepository
      .createQueryBuilder('items')
      .where('items.id = :id', { id })
      .getOne();

    if (!item) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    return item;
  }

  async findRemakeItem(): Promise<OrderItems[]> {
    return await this.orderItemsRepository
      .createQueryBuilder('items')
      .leftJoin('remake_product', 'product', 'product.id = items.product_id')
      .leftJoin('orders', 'orders', 'items.order_id = orders.id')
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
      ])
      .where('items.category = "reborn"')
      .getRawMany();
  }

  // 리본 리메이크 제품 판매 횟수 조회
  async readRebornRemakeCnt(): Promise<{ rebornRemakeCnt: string }> {
    return await this.orderItemsRepository
      .createQueryBuilder('items')
      .select('COUNT(*) AS rebornRemakeCnt')
      .where('items.category = "reborn"')
      .getRawOne();
  }

  async updateItemById(
    id: number,
    updateData: Partial<OrderItems>,
  ): Promise<object> {
    await this.findItemById(id); // 확인

    await this.orderItemsRepository.update(id, updateData); // 데이터 수정

    return { message: '성공적으로 변경되었습니다.' };
  }
}
