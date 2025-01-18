/**
File Name : cart.service
Description : 장바구니 Service
Author : 이유민

History
Date        Author      Status      Description
2025.01.11  이유민      Created     
2025.01.11  이유민      Modified    장바구니 추가
2025.01.15  이유민      Modified    장바구니 아이템 추가
2025.01.17  이유민      Modified    사용자의 모든 아이템 삭제 추가
*/
import { Injectable } from '@nestjs/common';
import { Cart } from 'src/modules/cart/entity/cart.entity';
import { CartItem } from 'src/modules/cart/entity/cart_items.entity';
import { CartRepository } from 'src/modules/cart/repository/cart.repository';
import { CartItemRepository } from 'src/modules/cart/repository/cart_items.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly itemRepository: CartItemRepository,
  ) {}

  // 장바구니 생성
  async createCart(
    user_id: number,
    newCartItem: { product_id: string; quantity: number },
  ): Promise<object> {
    let cart = await this.cartRepository.findCartByUserId(user_id);

    if (!cart) {
      cart = await this.cartRepository.createCart(user_id);
    }

    await this.itemRepository.createItem({
      cart_id: cart.id,
      product_id: newCartItem.product_id,
      quantity: newCartItem.quantity,
    });

    return { message: '장바구니에 제품이 성공적으로 추가되었습니다.' };
  }

  async findCartByUserId(user_id: number): Promise<Cart> {
    return await this.cartRepository.findCartByUserId(user_id);
  }

  async findItemByUserId(user_id: number): Promise<CartItem[]> {
    return await this.itemRepository.findItemByUserId(user_id);
  }

  async updateItemById(
    id: number,
    user_id: number,
    updateData: Partial<CartItem>,
  ): Promise<object> {
    return await this.itemRepository.updateItemById(id, user_id, updateData);
  }

  async deleteItemById(id: number, user_id: number): Promise<object> {
    return await this.itemRepository.deleteItemById(id, user_id);
  }

  async deleteItemAll(user_id: number): Promise<object> {
    const items = await this.itemRepository.findItemByUserId(user_id);

    for (const item of items) {
      await this.itemRepository.deleteItemById(item['item_id'], user_id);
    }

    return { message: '장바구니 아이템이 성공적으로 삭제되었습니다.' };
  }
}
