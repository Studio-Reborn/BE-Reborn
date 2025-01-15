/**
File Name : cart.service
Description : 장바구니 Service
Author : 이유민

History
Date        Author      Status      Description
2025.01.11  이유민      Created     
2025.01.11  이유민      Modified    장바구니 추가
*/
import { Injectable } from '@nestjs/common';
import { Cart } from 'src/modules/cart/cart.entity';
import { CartRepository } from 'src/modules/cart/cart.repository';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  // 장바구니 생성
  async createCart(
    user_id: number,
    newCartItem: { product_id: string; quantity: number },
  ): Promise<object> {
    return await this.cartRepository.createCart(user_id, newCartItem);
  }

  async findCartByUserId(user_id: number): Promise<Cart> {
    return await this.cartRepository.findCartByUserId(user_id);
  }
}
