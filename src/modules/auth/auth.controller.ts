/**
File Name : auth.controller
Description : 회원가입 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.07  이유민      Created     
2024.11.07  이유민      Modified    회원 기능 추가
2024.11.12  이유민      Modified    jwt 추가
2024.11.13  이유민      Modified    토큰 검증 추가
*/
import {
  Controller,
  Post,
  Body,
  Get,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Res,
  Headers,
} from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { SignUpDTO, SignInDTO } from 'src/modules/auth/auth.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from 'src/modules/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // 회원가입
  @Post('/signup')
  async signup(@Body() signupDTO: SignUpDTO) {
    const { nickname, email, password, phone } = signupDTO;

    if (!nickname || !email || !password || !phone)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    const phoneCheck = await this.usersService.findUserByPhone(phone);
    if (phoneCheck) {
      throw new ConflictException('이미 존재하는 전화번호입니다.');
    }

    const emailCheck = await this.usersService.findUserByEmail(email);
    if (emailCheck) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const auth_id = await this.authService.createAuth({ password });

    await this.usersService.createUsers({
      nickname,
      email,
      auth_id,
      phone,
    });

    return { message: '회원가입 완료' };
  }

  // 로그인
  @Post('/signin')
  async signin(@Body() signinDTO: SignInDTO, @Res() res: Response) {
    const { email, password } = signinDTO;

    if (!email || !password)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    const authData = await this.authService.findPasswordById(user['auth_id']);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }
    if (await bcrypt.compare(password, authData['password'])) {
      const jwt = await this.authService.login(
        user.id,
        user.email,
        authData.id,
        res,
      );

      return res.status(200).send(jwt);
    } else {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }
  }

  // 토큰 검증
  @Get('verify')
  async verifyToken(@Headers('Authorization') authorization: string) {
    // 토큰 추출
    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    return await this.authService.verifyToken(token);
  }
}
