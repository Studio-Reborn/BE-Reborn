/**
File Name : cart.repository
Description : 장바구니 Repository
Author : 이유민

History
Date        Author      Status      Description
2025.01.11  이유민      Created     
2025.01.11  이유민      Modified    장바구니 추가
*/
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/modules/cart/cart.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  // 장바구니 생성 및 추가
  async createCart(
    user_id: number,
    newCartItem: { product_id: string; quantity: number },
  ): Promise<object> {
    const cart = await this.findCartByUserId(user_id);

    if (cart) {
      cart.cart_items = await this.updateCartItems(
        cart.cart_items,
        newCartItem,
      );
      await this.cartRepository.save(cart);

      return { message: '장바구니가 성공적으로 추가되었습니다.' };
    }

    const newCart = this.cartRepository.create({
      user_id,
      cart_items: JSON.stringify([newCartItem]),
    });
    await this.cartRepository.save(newCart);

    return { message: '장바구니가 성공적으로 생성되었습니다.' };
  }

  // 사용자 장바구니 조회
  async findCartByUserId(user_id: number): Promise<Cart> {
    return await this.cartRepository
      .createQueryBuilder('cart')
      .where('cart.user_id = :user_id', { user_id })
      .getOne();
  }

  // 장바구니 아이템 수정
  async updateCartItems(
    oldCartItems: string,
    newCartItem: { product_id: string; quantity: number },
  ): Promise<string> {
    const cartItems = JSON.parse(oldCartItems || '[]');
    cartItems.push(newCartItem);

    return JSON.stringify(cartItems);
  }
}
