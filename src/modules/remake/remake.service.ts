/**
File Name : remake.service
Description : 리본 리메이크 Service
Author : 이유민

History
Date        Author      Status      Description
2024.11.03  이유민      Created     
2024.11.03  이유민      Modified    리본 리메이크 제품 요청 기능 추가
2024.11.06  이유민      Modified    리본 리메이크 제품 추천 기능 추가
2024.11.08  이유민      Modified    리본 리메이크 제품 조회 추가
2024.11.18  이유민      Modified    리본 리메이크 제품 CRUD 추가
2024.12.04  이유민      Modified    요청 조회 기능 추가
2024.12.04  이유민      Modified    요청 삭제 기능 추가
*/
import { Injectable } from '@nestjs/common';
import { RemakeRepository } from 'src/modules/remake/remake.repository';
import { Remake, RemakeProduct } from 'src/modules/remake/remake.entity';
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

  // 리메이크 요청 생성
  async createRemake(remakeData: Partial<Remake>): Promise<Remake> {
    return this.remakeRepository.createRemake(remakeData);
  }

  // 리메이크 요청 전체 조회
  async findRequestProductAll(): Promise<Remake[]> {
    return this.remakeRepository.findRequestProductAll();
  }

  // 리메이크 요청 삭제
  async deleteRequestById(id: number): Promise<object> {
    return this.remakeRepository.deleteRequestById(id);
  }

  // 리메이크 추천
  async recommendRemake(thing: string): Promise<object> {
    const data = await firstValueFrom(
      this.httpService.get(`${this.aiServer}/recommend?thing=${thing}`),
    );

    return data.data;
  }

  // 리메이크 제품 생성
  async createRemakeProduct(
    productData: Partial<RemakeProduct>,
  ): Promise<object> {
    return this.remakeRepository.createRemakeProduct(productData);
  }

  // 리메이크 제품 전체 조회
  async findRemakeProductAll(): Promise<RemakeProduct[]> {
    return await this.remakeRepository.findRemakeProductAll();
  }

  // 리메이크 제품 개별 조회
  async findRemakeProductById(id: number): Promise<RemakeProduct> {
    return await this.remakeRepository.findRemakeProductById(id);
  }

  // 리메이크 제품 수정
  async updateRemakeProductById(
    id: number,
    updateData: Partial<RemakeProduct>,
  ): Promise<object> {
    return await this.remakeRepository.updateRemakeProductById(id, updateData);
  }

  // 리메이크 제품 삭제
  async deleteRemakeProductById(id: number): Promise<object> {
    return await this.remakeRepository.deleteRemakeProductById(id);
  }
}
