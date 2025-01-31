/**
File Name : cart_items.entity
Description : 장바구니 아이템 Entity
Author : 이유민

History
Date        Author      Status      Description
2025.01.15  이유민      Created     
2025.01.15  이유민      Modified    장바구니 아이템 추가
2025.01.16  이유민      Modified    아이템 조회 응답 결과 수정
2025.01.31  이유민      Modified    이미지 url 관련 오류 수정
*/
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from 'src/modules/cart/entity/cart_items.entity';

@Injectable()
export class CartItemRepository {
  constructor(
    @InjectRepository(CartItem)
    private readonly itemRepository: Repository<CartItem>,
  ) {}

  async createItem(itemData: Partial<CartItem>): Promise<CartItem> {
    const item = this.itemRepository.create(itemData);
    return await this.itemRepository.save(item);
  }

  // 장바구니 아이템 조회
  async findItemByUserId(user_id: number): Promise<CartItem[]> {
    const items = await this.itemRepository
      .createQueryBuilder('item')
      .innerJoin('cart', 'cart', 'item.cart_id = cart.id')
      .leftJoin(
        'market_product',
        'market_product',
        'item.product_id = market_product.id',
      )
      .leftJoin(
        'remake_product',
        'remake_product',
        'item.product_id = remake_product.id',
      )
      .leftJoin('market', 'market', 'market_product.market_id = market.id')
      .leftJoin(
        'product_image',
        'pi1',
        'market_product.product_image_id = pi1.id',
      )
      .leftJoin(
        'product_image',
        'pi2',
        'remake_product.product_image_id = pi2.id',
      )
      .select([
        'item.id AS item_id',
        'item.product_id AS product_id',
        'item.quantity AS item_quantity',
        `(CASE 
            WHEN market_product.id IS NOT NULL THEN market_product.name
            WHEN remake_product.id IS NOT NULL THEN remake_product.name
        END) AS product_name`,
        `(CASE 
            WHEN market_product.id IS NOT NULL THEN market.market_name
            WHEN remake_product.id IS NOT NULL THEN "Reborn"
        END) AS market_name`,
        `(CASE 
            WHEN market_product.id IS NOT NULL THEN market.id
            WHEN remake_product.id IS NOT NULL THEN "Reborn"
        END) AS market_id`,
        `(CASE 
            WHEN market_product.id IS NOT NULL THEN pi1.url
            WHEN remake_product.id IS NOT NULL THEN pi2.url
        END) AS product_image_url`,
        `(CASE 
            WHEN market_product.id IS NOT NULL THEN market_product.price
            WHEN remake_product.id IS NOT NULL THEN remake_product.price
            END) AS product_price`,
      ])
      .where('cart.user_id = :user_id AND item.deleted_at IS NULL', { user_id })
      .getRawMany();

    items.forEach((item) => {
      if (item.product_image_url) {
        item.product_image_url = JSON.parse(item.product_image_url);
      }
    });

    return items;
  }

  async findItemById(id: number): Promise<CartItem & { user_id: number }> {
    return await this.itemRepository
      .createQueryBuilder('item')
      .leftJoin('cart', 'cart', 'cart.id = item.cart_id')
      .addSelect('cart.user_id AS user_id')
      .where('item.id = :id AND item.deleted_at IS NULL', { id })
      .getRawOne();
  }

  async updateItemById(
    id: number,
    user_id: number,
    updateData: Partial<CartItem>,
  ): Promise<object> {
    const item = await this.findItemById(id);

    if (!item) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    if (user_id !== item.user_id)
      throw new UnauthorizedException('접근할 수 없습니다.');

    await this.itemRepository.update(id, updateData);

    return { message: '장바구니 아이템이 성공적으로 변경되었습니다.' };
  }

  async deleteItemById(id: number, user_id: number): Promise<object> {
    const item = await this.findItemById(id);

    if (!item) throw new NotFoundException('리소스를 찾을 수 없습니다.');

    if (user_id !== item.user_id)
      throw new UnauthorizedException('접근할 수 없습니다.');

    await this.itemRepository.update(id, { deleted_at: new Date() });

    return { message: '장바구니 아이템이 성공적으로 삭제되었습니다.' };
  }
}
