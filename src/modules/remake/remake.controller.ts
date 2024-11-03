/**
File Name : remake.dto
Description : 리본 리메이크 Dto
Author : 이유민

History
Date        Author      Status      Description
2024.11.03  이유민      Created     
2024.11.03  이유민      Modified    리본 리메이크 제품 요청 기능 추가
*/
import { Body, Controller, Post } from '@nestjs/common';
import { RemakeService } from 'src/modules/remake/remake.service';
import { Remake } from 'src/modules/remake/remake.entity';

@Controller('remake')
export class RemakeController {
  constructor(private readonly remakeService: RemakeService) {}

  @Post()
  async create(@Body() remakeData: Partial<Remake>): Promise<Remake> {
    return this.remakeService.createRemake(remakeData);
  }
}
