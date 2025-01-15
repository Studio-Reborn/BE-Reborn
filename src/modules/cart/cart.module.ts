/**
File Name : cart.module
Description : 장바구니 Module
Author : 이유민

History
Date        Author      Status      Description
2025.01.11  이유민      Created     
2025.01.11  이유민      Modified    장바구니 추가
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/modules/cart/cart.entity';
import { CartRepository } from 'src/modules/cart/cart.repository';
import { CartService } from 'src/modules/cart/cart.service';
import { CartController } from 'src/modules/cart/cart.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cart])],
  providers: [CartRepository, CartService],
  controllers: [CartController],
})
export class CartModule {}
