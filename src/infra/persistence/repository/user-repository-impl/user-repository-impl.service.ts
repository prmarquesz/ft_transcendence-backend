import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../app/repository/user-repository';
import {
  Prisma,
  PrismaClient,
  User,
  Channel,
  BlockedUser,
} from '@prisma/client';

@Injectable()
export class UserRepositoryImplService implements UserRepository {
  private prisma: PrismaClient;

  constructor(@Inject('PrismaClient') prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async save(user: Prisma.UserCreateInput): Promise<User> {
    return await this.prisma.user.create({ data: user });
  }

  async update(userId: number, user: Prisma.UserUpdateInput): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: user,
    });
  }

  async findByNickname(nickname: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { nickname },
    });
  }

  async findByNicknameWithChannels(
    nickname: string,
  ): Promise<User & { channels?: Channel[] }> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { nickname },
      include: { channels: true },
    });
  }

  async findByNicknameWithChannelsAndBlockedUsers(
    nickname: string,
  ): Promise<User & { channels?: Channel[]; blockedUsers?: BlockedUser[] }> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { nickname },
      include: {
        channels: true,
        blockedUsers: true,
      },
    });
  }
}
