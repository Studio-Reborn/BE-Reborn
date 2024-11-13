/**
File Name : profile_image.service
Description : 프로필 이미지 Service
Author : 이유민

History
Date        Author      Status      Description
2024.11.13  이유민      Created     
2024.11.13  이유민      Modified    프로필 이미지 추가
*/
import { Injectable } from '@nestjs/common';
import { Profile } from 'src/modules/profile_image/profile_image.entity';
import { ProfileRepository } from 'src/modules/profile_image/profile_image.repository';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async createProfile(profileData: Partial<Profile>): Promise<Profile> {
    return this.profileRepository.createProfile(profileData);
  }

  async findProfileById(id: number): Promise<Profile> {
    return this.profileRepository.findProfileById(id);
  }
}
