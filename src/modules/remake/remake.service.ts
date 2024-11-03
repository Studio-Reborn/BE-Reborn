/**
File Name : remake.service
Description : 리본 리메이크 Service
Author : 이유민

History
Date        Author      Status      Description
2024.11.03  이유민      Created     
2024.11.03  이유민      Modified    리본 리메이크 제품 요청 기능 추가
*/
import { Injectable } from '@nestjs/common';
import { RemakeRepository } from 'src/modules/remake/remake.repository';
import { Remake } from 'src/modules/remake/remake.entity';

@Injectable()
export class RemakeService {
  constructor(private readonly remakeRepository: RemakeRepository) {}

  async createRemake(remakeData: Partial<Remake>): Promise<Remake> {
    return this.remakeRepository.createRemake(remakeData);
  }
}
