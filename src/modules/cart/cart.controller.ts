/**
File Name : cart.controller
Description : 장바구니 Controller
Author : 이유민

History
Date        Author      Status      Description
2025.01.11  이유민      Created     
2025.01.11  이유민      Modified    장바구니 추가
2025.01.15  이유민      Modified    장바구니 아이템 추가
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
  Patch,
  Param,
  ParseIntPipe,
  Delete,
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
    summary: '장바구니 아이템 추가 API',
    description: '장바구니 아이템을 추가한다.',
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

  // 장바구니 아이템 조회
  @Get('item')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '장바구니 아이템 조회 API',
    description: '장바구니 아이템을 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findItemByUserId(@Req() req) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return await this.cartService.findItemByUserId(req.user.user_id);
  }

  @Patch('/item/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '장바구니 아이템 수정 API',
    description: '장바구니 아이템을 수정한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async updateItemById(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() cartDTO: CartDTO,
  ) {
    const { quantity } = cartDTO;

    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!quantity)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.cartService.updateItemById(id, req.user.user_id, {
      quantity,
    });
  }

  @Delete('/item/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '장바구니 아이템 삭제 API',
    description: '장바구니 아이템을 삭제한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async deleteItemById(@Req() req, @Param('id', ParseIntPipe) id: number) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    return await this.cartService.deleteItemById(id, req.user.user_id);
  }
}
