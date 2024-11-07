/**
File Name : remake.service
Description : 리본 리메이크 Service
Author : 이유민

History
Date        Author      Status      Description
2024.11.03  이유민      Created     
2024.11.03  이유민      Modified    리본 리메이크 제품 요청 기능 추가
2024.11.06  이유민      Modified    리본 리메이크 제품 추천 기능 추가
*/
import { Injectable } from '@nestjs/common';
import { RemakeRepository } from 'src/modules/remake/remake.repository';
import { Remake } from 'src/modules/remake/remake.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RemakeService {
  private readonly aiServer: string;

  constructor(
    private readonly remakeRepository: RemakeRepository,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.aiServer = this.configService.get<string>('AI_SERVER_URL');
  }

  async createRemake(remakeData: Partial<Remake>): Promise<Remake> {
    return this.remakeRepository.createRemake(remakeData);
  }

  async recommendRemake(thing: string): Promise<object> {
    const data = await firstValueFrom(
      this.httpService.get(`${this.aiServer}/recommend?thing=${thing}`),
    );

    return data.data;
  }
}
