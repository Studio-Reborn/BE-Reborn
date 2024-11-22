/**
File Name : users.repository
Description : 사용자 Repository
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
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/users.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUsers(usersData: Partial<Users>): Promise<Users> {
    const users = this.usersRepository.create(usersData);
    return await this.usersRepository.save(users);
  }

  async findUserByEmail(email: string): Promise<Users | undefined> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    return user;
  }

  async findUserByPhone(phone: string): Promise<Users | undefined> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.phone = :phone', { phone })
      .getOne();

    return user;
  }

  async findUserById(id: number): Promise<Users> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();

    return user;
  }

  async updateNickname(id: number, nickname: string): Promise<object> {
    const user = await this.findUserById(id);

    Object.assign(user, { nickname });
    await this.usersRepository.save(user);

    return { message: '닉네임이 변경되었습니다.' };
  }

  async updateProfileImageId(
    id: number,
    profile_image_id: number,
  ): Promise<object> {
    const user = await this.findUserById(id);

    Object.assign(user, { profile_image_id });
    await this.usersRepository.save(user);

    return { message: '프로필 이미지가 변경되었습니다.' };
  }
}
