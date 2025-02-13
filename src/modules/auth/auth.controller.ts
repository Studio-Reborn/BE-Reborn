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
2024.11.13  이유민      Modified    비밀번호 변경 추가
2024.11.18  이유민      Modified    swagger 추가
2024.12.04  이유민      Modified    role 추가
2025.01.19  이유민      Modified    아이디 찾기 및 비밀번호 찾기 추가
2025.02.13  이유민      Modified    swagger 설명 수정
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
  Patch,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { SignUpDTO, SignInDTO } from 'src/modules/auth/auth.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from 'src/modules/users/users.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('회원 API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // 회원가입
  @Post('/signup')
  @ApiOperation({
    summary: '회원가입 API',
    description: '리본 서비스에 가입한다.',
  })
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
  @ApiOperation({
    summary: '로그인 API',
    description: '리본 서비스에 로그인한다.',
  })
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
        user.role,
      );

      return res.status(200).send(jwt);
    } else {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }
  }

  // 토큰 검증
  @Get('verify')
  @ApiOperation({
    summary: '토큰 검증 API',
    description: 'JWT 토큰을 검증한다.',
  })
  async verifyToken(@Headers('Authorization') authorization: string) {
    // 토큰 추출
    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    return await this.authService.verifyToken(token);
  }

  // 비밀번호 변경
  @Patch('/change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '비밀번호 변경 API',
    description: '사용자 비밀번호를 변경한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async updatePassword(
    @Req() req,
    @Body() body: { password: string; changePassword: string },
  ) {
    const { password, changePassword } = body;

    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 이용 가능합니다.');

    if (!password || !changePassword)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    const authData = await this.authService.findPasswordById(req.user.user_id);

    if (!(await bcrypt.compare(password, authData['password'])))
      throw new UnauthorizedException('현재 비밀번호가 틀렸습니다.');

    return await this.authService.updatePassword(
      req.user.user_id,
      bcrypt.hashSync(changePassword, 10),
    );
  }

  // 아이디 찾기
  @Get('/find-email')
  @ApiOperation({
    summary: '아이디 찾기 API',
    description: '아이디를 찾는다.',
  })
  async findEmail(
    @Query('nickname') nickname: string,
    @Query('phone') phone: string,
  ) {
    if (!nickname || !phone)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.authService.findEmail(nickname, phone);
  }

  // 비밀번호 찾기
  @Get('/find-password')
  @ApiOperation({
    summary: '비밀번호 찾기 API',
    description: '임시 비밀번호를 발급 받는다.',
  })
  async findPassword(
    @Query('email') email: string,
    @Query('nickname') nickname: string,
    @Query('phone') phone: string,
  ) {
    if (!nickname || !phone || !email)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.authService.findPassword(email, nickname, phone);
  }
}
