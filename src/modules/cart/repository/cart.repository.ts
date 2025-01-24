/**
File Name : cart.repository
Description : 장바구니 Repository
Author : 이유민

History
Date        Author      Status      Description
2025.01.11  이유민      Created     
2025.01.11  이유민      Modified    장바구니 추가
2025.01.15  이유민      Modified    데이터 구조 수정
*/
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/modules/cart/entity/cart.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  // 장바구니 생성 및 추가
  async createCart(user_id: number): Promise<Cart> {
    const cart = this.cartRepository.create({
      user_id,
    });
    return await this.cartRepository.save(cart);
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
