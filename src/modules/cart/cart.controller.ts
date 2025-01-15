/**
File Name : cart.controller
Description : 장바구니 Controller
Author : 이유민

History
Date        Author      Status      Description
2025.01.11  이유민      Created     
2025.01.11  이유민      Modified    장바구니 추가
*/
import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  UnauthorizedException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { CartDTO } from 'src/modules/cart/cart.dto';
import { CartService } from 'src/modules/cart/cart.service';

@Controller('cart')
@ApiTags('장바구니 API')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // 장바구니 추가
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '장바구니 생성 API',
    description: '장바구니 데이터를 생성한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async createCart(@Req() req, @Body() cartDTO: CartDTO) {
    const { product_id, quantity } = cartDTO;

    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!product_id || !quantity)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.cartService.createCart(req.user.user_id, {
      product_id,
      quantity,
    });
  }

  // 장바구니 조회
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '장바구니 생성 API',
    description: '장바구니 데이터를 생성한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findCartByUserId(@Req() req) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return await this.cartService.findCartByUserId(req.user.user_id);
  }
}
