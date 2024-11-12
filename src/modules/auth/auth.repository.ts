/**
File Name : auth.repository
Description : 회원가입 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    회원 기능 추가
2024.11.12  이유민      Modified    jwt 추가
*/
import { Injectable } from '@nestjs/common';
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
}
