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
*/
import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/modules/users/users.repository';
import { Users } from 'src/modules/users/users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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
}
