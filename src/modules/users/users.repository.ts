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
2024.12.04  이유민      Modified    전체 사용자 조회 추가
2024.12.04  이유민      Modified    사용자 유형 수정 추가
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

  async findAllUser(): Promise<Users[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin(
        'profile_image',
        'profile',
        'user.profile_image_id = profile.id',
      )
      .select([
        'user.id AS user_id',
        'user.email AS user_email',
        'user.phone AS user_phone',
        'user.nickname AS user_nickname',
        'user.created_at AS user_created_at',
        'user.role AS user_role',
        'profile.url AS profile_image',
      ])
      .where('user.deleted_at IS NULL')
      .getRawMany();
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

  async updateRole(id: number): Promise<object> {
    const user = await this.findUserById(id);

    Object.assign(user, { role: user.role === 'admin' ? 'user' : 'admin' });
    await this.usersRepository.save(user);

    return { message: '사용자 유형이 변경되었습니다.' };
  }
}
