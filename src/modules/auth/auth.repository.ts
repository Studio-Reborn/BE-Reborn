/**
File Name : auth.repository
Description : 회원가입 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    회원 기능 추가
2024.11.12  이유민      Modified    jwt 추가
2024.11.13  이유민      Modified    비밀번호 변경 추가
2025.01.19  이유민      Modified    아이디 찾기 및 비밀번호 찾기 추가
*/
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/modules/auth/auth.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
  ) {}

  async createAuth(authData: Partial<Auth>): Promise<number> {
    const auth = this.authRepository.create(authData);
    const savedAuth = await this.authRepository.save(auth);

    return savedAuth.id;
  }

  async updateRefreshToken(id: number, token: string): Promise<any> {
    const auth = await this.findAuthById(id);

    Object.assign(auth, { refresh_token: token });
    await this.authRepository.save(auth);
  }

  async updatePassword(
    id: number,
    hashedChangePassword: string,
  ): Promise<object> {
    const auth = await this.findAuthById(id);

    Object.assign(auth, { password: hashedChangePassword });
    await this.authRepository.save(auth);

    return { message: '비밀번호가 변경되었습니다.' };
  }

  async findAuthById(id: number): Promise<Auth> {
    return this.authRepository
      .createQueryBuilder('auth')
      .where('auth.id = :id', { id })
      .getOne();
  }

  async findPasswordById(id: number): Promise<Auth | undefined> {
    return this.authRepository
      .createQueryBuilder('auth')
      .where('auth.id = :id', { id })
      .getOne();
  }

  // 아이디 찾기
  async findEmail(nickname: string, phone: string): Promise<Auth> {
    const user = await this.authRepository
      .createQueryBuilder('auth')
      .leftJoin('users', 'users', 'auth.id = users.auth_id')
      .leftJoin(
        'profile_image',
        'profile',
        'users.profile_image_id = profile.id',
      )
      .select([
        'users.id AS user_id',
        'users.email AS user_email',
        'users.phone AS user_phone',
        'users.nickname AS user_nickname',
        'users.created_at AS user_created_at',
        'profile.url AS profile_image_url',
      ])
      .where(
        'users.nickname = :nickname AND users.phone = :phone AND users.deleted_at IS NULL',
        { nickname, phone },
      )
      .getRawOne();

    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');

    return user;
  }
}
