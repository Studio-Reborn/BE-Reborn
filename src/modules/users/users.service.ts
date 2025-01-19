/**
File Name : users.service
Description : 사용자 Service
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    회원 기능 추가
2024.11.13  이유민      Modified    사용자 정보 조회 추가
2024.11.13  이유민      Modified    프로필 이미지 변경 추가
2024.11.13  이유민      Modified    닉네임 수정 추가
2024.12.04  이유민      Modified    전체 사용자 조회 추가
2024.12.04  이유민      Modified    사용자 유형 수정 추가
2025.01.05  이유민      Modified    검색 및 정렬 추가
2025.01.09  이유민      Modified    사용자 정보 수정 추가
2025.01.19  이유민      Modified    회원 탈퇴 추가
*/
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Users } from 'src/modules/users/users.entity';
import { UsersRepository } from 'src/modules/users/users.repository';
import { MarketRepository } from 'src/modules/market/market.repository';
import { UserProductRepository } from 'src/modules/product/repository/user_product.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly marketRepository: MarketRepository,
    private readonly userProductRepository: UserProductRepository,
  ) {}

  async createUsers(usersData: Partial<Users>): Promise<Users> {
    return this.usersRepository.createUsers(usersData);
  }

  async findAllUser(search?: string, sort?: string): Promise<Users[]> {
    return this.usersRepository.findAllUser(search, sort);
  }

  async findUserByEmail(email: string): Promise<Users | undefined> {
    return this.usersRepository.findUserByEmail(email);
  }

  async findUserByPhone(phone: string): Promise<Users | undefined> {
    return this.usersRepository.findUserByPhone(phone);
  }

  async findUserById(id: number): Promise<Users> {
    return this.usersRepository.findUserById(id);
  }

  async updateNickname(id: number, nickname: string): Promise<object> {
    return this.usersRepository.updateNickname(id, nickname);
  }

  async updateUser(id: number, updateData: object): Promise<object> {
    return this.usersRepository.updateUser(id, updateData);
  }

  async updateProfileImageId(
    id: number,
    profile_image_id: number,
  ): Promise<object> {
    return this.usersRepository.updateProfileImageId(id, profile_image_id);
  }

  async updateRole(id: number): Promise<object> {
    return this.usersRepository.updateRole(id);
  }

  // 회원 탈퇴
  async deleteUser(id: number): Promise<object> {
    // 존재하는 회원인지 확인
    const user = await this.usersRepository.findUserById(id);
    if (!user) throw new UnauthorizedException('접근할 수 없습니다.');

    // 회원의 에코마켓이 있는지 확인
    const isMarket = await this.marketRepository.findMarketByUserId(id);
    if (isMarket)
      throw new ConflictException(
        '활성화된 에코마켓 때문에 회원 탈퇴가 제한됩니다',
      );

    await this.userProductRepository.deleteProductByUserId(id); // 회원의 중고거래 제품 전체 삭제
    return await this.usersRepository.deleteUser(id); // 회원 탈퇴
  }
}
