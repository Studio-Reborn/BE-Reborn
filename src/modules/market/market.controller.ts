/**
File Name : market.controller
Description : 에코마켓 Controller
Author : 이유민

History
Date        Author      Status      Description
2024.11.21  이유민      Created     
2024.11.21  이유민      Modified    에코마켓 추가
2024.12.04  이유민      Modified    에코마켓 삭제(관리자) 기능 추가
2024.12.04  이유민      Modified    생성 및 삭제 요청 조회 기능 추가
2024.12.04  이유민      Modified    swagger 수정
2025.01.02  이유민      Modified    검색 및 정렬 추가
2025.01.18  이유민      Modified    내 마켓 관련 API 추가
2025.01.20  이유민      Modified    요청 반려 관련 API 추가
2025.01.21  이유민      Modified    에코마켓 신청 철회 API 추가
2025.01.23  이유민      Modified    에코마켓 관련 페이지네이션 추가
*/
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
  ParseIntPipe,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { MarketDTO } from 'src/modules/market/market.dto';
import { MarketService } from 'src/modules/market/market.service';

@Controller('market')
@ApiTags('에코마켓 API')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  // 에코마켓 생성
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '에코마켓 생성 API',
    description: '에코마켓을 생성한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async createMarket(@Req() req, @Body() marketDTO: MarketDTO) {
    const { profile_image_id, market_name, market_detail } = marketDTO;
    return await this.marketService.createMarket({
      user_id: req.user.user_id,
      profile_image_id,
      market_name,
      market_detail,
    });
  }

  // 에코마켓 전체 조회
  @Get()
  @ApiOperation({
    summary: '에코마켓 전체 조회 API',
    description: '에코마켓을 전체 조회한다.',
  })
  async findMarketAll(
    @Query('sort') sort?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
  ) {
    if (sort !== 'name' && sort !== 'latest' && sort !== 'likes')
      sort = 'latest';

    if (!page) page = 1;

    return await this.marketService.findMarketAll(sort, search, page);
  }

  // 에코마켓 개별 조회
  @Get('/info/:id')
  @ApiOperation({
    summary: '에코마켓 개별 조회 API',
    description: '에코마켓을 개별로 조회한다.',
  })
  async findMarketById(@Param('id', ParseIntPipe) id: number) {
    return await this.marketService.findMarketById(id);
  }

  // 본인 에코마켓 조회
  @Get('/my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '에코마켓 개별 조회 API',
    description: '에코마켓을 개별로 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findMarketByUserId(@Req() req) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 접근 가능합니다.');

    return await this.marketService.findMarketByUserId(req.user.user_id);
  }

  // 본인 에코마켓 조회
  @Get('/my/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '에코마켓 개별 조회 API',
    description: '에코마켓을 개별로 조회한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async findMyMarketById(@Req() req, @Param('id', ParseIntPipe) id: number) {
    if (!req.user.user_id)
      throw new UnauthorizedException('로그인 후 접근 가능합니다.');

    return await this.marketService.findMyMarketById(id, req.user.user_id);
  }

  // 새로 신청한 에코마켓 조회
  @Get('/request/new')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '생성 요청된 에코마켓 전체 조회 API',
    description: '생성 요청된 에코마켓을 전체 조회한다.',
  })
  async findCreateMarket(@Req() req) {
    if (req.user.role !== 'admin')
      throw new UnauthorizedException('관리자만 접근 가능합니다.');

    return await this.marketService.findCreateMarket();
  }

  // 삭제 요청한 에코마켓 조회
  @Get('/request/delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '삭제 요청된 에코마켓 전체 조회 API',
    description: '삭제 요청된 에코마켓을 전체 조회한다.',
  })
  async findDeleteMarket(@Req() req) {
    if (req.user.role !== 'admin')
      throw new UnauthorizedException('관리자만 접근 가능합니다.');

    return await this.marketService.findDeleteMarket();
  }

  // 신청된 에코마켓 생성
  @Patch('/request/check/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '생성 요청된 에코마켓 생성 API',
    description: '관리자가 생성 요청된 에코마켓을 확인 후 생성한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async updateIsVerified(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('is_verified') is_verified: string,
  ) {
    if (req.user.role !== 'admin')
      throw new UnauthorizedException('관리자만 접근 가능합니다.');

    if (
      !is_verified ||
      !['pending', 'approved', 'rejected'].includes(is_verified)
    )
      throw new BadRequestException('잘못된 값을 입력했습니다.');

    return await this.marketService.updateIsVerified(id, is_verified);
  }

  // 에코마켓 재심사 요청
  @Patch('/retry/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '에코마켓 정보 수정 API',
    description: '에코마켓 정보를 수정한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async retryMarket(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: MarketDTO,
  ) {
    if (!req.user)
      throw new UnauthorizedException('로그인 후 접근 가능합니다.');

    const { profile_image_id, market_name, market_detail } = updateData;
    return await this.marketService.retryMarket(id, {
      profile_image_id,
      market_name,
      market_detail,
      is_verified: 'pending',
    });
  }

  // 에코마켓 정보 수정
  @Patch('/info/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '에코마켓 정보 수정 API',
    description: '에코마켓 정보를 수정한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async updateMarketInfo(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: MarketDTO,
  ) {
    return await this.marketService.updateMarketInfo(
      req.user.user_id,
      id,
      updateData,
    );
  }

  // 에코마켓 삭제 요청
  @Patch('/request/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '에코마켓 삭제 요청 API',
    description: '관리자에게 에코마켓 삭제 요청한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async deleteRequestMarket(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return await this.marketService.deleteRequestMarket(req.user.user_id, id);
  }

  // 에코마켓 실제 삭제
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '삭제 요청된 에코마켓 삭제 API',
    description: '관리자가 삭제 요청된 에코마켓을 확인 후 삭제한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async deleteRemakeProductById(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Query('is_deletion_requested') is_deletion_requested: string,
  ) {
    if (req.user.role !== 'admin')
      throw new UnauthorizedException('관리자만 접근 가능합니다.');

    if (
      !is_deletion_requested ||
      !['pending', 'approved', 'rejected'].includes(is_deletion_requested)
    )
      throw new BadRequestException('잘못된 값을 입력했습니다.');

    return this.marketService.deleteMarketById(id, is_deletion_requested);
  }

  @Post('/rejection/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '삭제 요청된 에코마켓 삭제 API',
    description: '관리자가 삭제 요청된 에코마켓을 확인 후 삭제한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async writeRejectionReason(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
  ) {
    if (!req.user)
      throw new UnauthorizedException('로그인 후 사용 가능합니다.');

    if (req.user.role !== 'admin')
      throw new UnauthorizedException('관리자만 접근 가능합니다.');

    if (!reason || !id)
      throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.marketService.writeRejectionReason(id, reason);
  }

  @Get('/rejection/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '삭제 요청된 에코마켓 삭제 API',
    description: '관리자가 삭제 요청된 에코마켓을 확인 후 삭제한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async readRejectionReason(@Req() req, @Param('id', ParseIntPipe) id: number) {
    if (!req.user)
      throw new UnauthorizedException('로그인 후 사용 가능합니다.');

    if (!id) throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.marketService.readRejectionReason(id);
  }

  @Patch('/rejection/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '삭제 요청된 에코마켓 삭제 API',
    description: '관리자가 삭제 요청된 에코마켓을 확인 후 삭제한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async changeVisibility(@Req() req, @Param('id', ParseIntPipe) id: number) {
    if (!req.user)
      throw new UnauthorizedException('로그인 후 사용 가능합니다.');

    if (!id) throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.marketService.changeVisibility(id);
  }

  @Delete('/rejection/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '삭제 요청된 에코마켓 삭제 API',
    description: '관리자가 삭제 요청된 에코마켓을 확인 후 삭제한다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰 형식의 JWT',
    required: true,
  })
  async deleteRejectedMarket(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    if (!req.user)
      throw new UnauthorizedException('로그인 후 사용 가능합니다.');

    if (!id) throw new BadRequestException('입력하지 않은 값이 있습니다.');

    return await this.marketService.deleteRejectedMarket(id, req.user.user_id);
  }
}
