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

  async updateProfileImageId(
    id: number,
    profile_image_id: number,
  ): Promise<object> {
    return this.usersRepository.updateProfileImageId(id, profile_image_id);
  }
}
