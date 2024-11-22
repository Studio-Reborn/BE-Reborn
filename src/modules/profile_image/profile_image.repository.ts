/**
File Name : profile_image.repository
Description : 프로필 이미지 Repository
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    프로필 이미지 추가
*/
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/modules/profile_image/profile_image.entity';

@Injectable()
export class ProfileRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async createProfile(profileData: Partial<Profile>): Promise<Profile> {
    const profile = this.profileRepository.create(profileData);
    return await this.profileRepository.save(profile);
  }

  async findProfileById(id: number): Promise<Profile> {
    const profile = await this.profileRepository
      .createQueryBuilder('profile')
      .where('profile.id = :id', { id })
      .getOne();

    return profile;
  }
}
