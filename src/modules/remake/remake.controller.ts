/**
File Name : remake.dto
Description : 리본 리메이크 Dto
Author : 이유민

History
Date        Author      Status      Description
2024.11.03  이유민      Created     
2024.11.03  이유민      Modified    리본 리메이크 제품 추천 기능 추가
2024.11.06  이유민      Modified    리본 리메이크 제품 요청 기능 추가
2024.11.08  이유민      Modified    리본 리메이크 제품 조회 추가
*/
import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { RemakeService } from 'src/modules/remake/remake.service';
import { RemakeDTO } from 'src/modules/remake/remake.dto';

@Controller('remake')
export class RemakeController {
  constructor(private readonly remakeService: RemakeService) {}

  @Post('/request')
  async create(@Body() remakeDTO: RemakeDTO) {
    const { remake_product } = remakeDTO;

    if (!remake_product)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return this.remakeService.createRemake({ user_id: 1, remake_product });
  }

  @Get()
  async recommendProduct(@Query('thing') thing: string) {
    return this.remakeService.recommendRemake(thing);
  }

  @Get('/product')
  async findRemakeProductAll() {
    return this.remakeService.findRemakeProductAll();
  }
}
