/**
File Name : remake.repository
Description : 리본 리메이크 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.03  이유민      Created     
2024.11.03  이유민      Modified    리본 리메이크 제품 요청 기능 추가
2024.11.08  이유민      Modified    리본 리메이크 제품 조회 추가
*/
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Remake, RemakeProduct } from 'src/modules/remake/remake.entity';

@Injectable()
export class RemakeRepository {
  constructor(
    @InjectRepository(Remake)
    private readonly remakeRepository: Repository<Remake>,
    @InjectRepository(RemakeProduct)
    private readonly remakeProductRepository: Repository<RemakeProduct>,
  ) {}

  async createRemake(remakeData: Partial<Remake>): Promise<Remake> {
    const remake = this.remakeRepository.create(remakeData);
    return await this.remakeRepository.save(remake);
  }

  async findRemakeProductAll(): Promise<RemakeProduct[]> {
    return await this.remakeProductRepository
      .createQueryBuilder('rproduct')
      .where('rproduct.deleted_at IS NULL')
      .getMany();
  }
}
