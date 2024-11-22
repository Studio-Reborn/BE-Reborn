/**
File Name : auth.module
Description : 회원가입 Module
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    회원 기능 추가
2024.11.12  이유민      Modified    jwt 추가
2024.11.13  이유민      Modified    jwt 관련 파일 경로 수정
*/
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/modules/auth/auth.entity';
import { AuthRepository } from 'src/modules/auth/auth.repository';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthController } from 'src/modules/auth/auth.controller';
import { Users } from 'src/modules/users/users.entity';
import { UsersRepository } from 'src/modules/users/users.repository';
import { UsersService } from 'src/modules/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/modules/auth/jwt/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, Users]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    JwtStrategy,
    AuthService,
    AuthRepository,
    UsersService,
    UsersRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
