/**
File Name : rejection.repository
Description : 에코마켓 요청 반려 관련 Repository
Author : 이유민

History
Date        Author      Status      Description
2025.01.20  이유민      Created     
2025.01.20  이유민      Modified    요청 반려 추가
*/

import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rejection } from 'src/modules/market/market.entity';

@Injectable()
export class RejectionRepository {
  constructor(
    @InjectRepository(Rejection)
    private readonly rejectionRepository: Repository<Rejection>,
  ) {}

  async createRejection(rejectionData: Partial<Rejection>): Promise<Rejection> {
    const rejection = this.rejectionRepository.create(rejectionData);
    return await this.rejectionRepository.save(rejection);
  }

  async findRejectionByMarketId(market_id: number): Promise<Rejection> {
    return await this.rejectionRepository
      .createQueryBuilder('rejection')
      .where(
        'rejection.market_id = :market_id AND rejection.visibility = TRUE',
        { market_id },
      )
      .getOne();
  }

  async updateRejection(
    id: number,
    updateData: Partial<Rejection>,
  ): Promise<object> {
    return await this.rejectionRepository.update(id, updateData);
  }
}
