import { User, Channel, BlockedUser, Prisma } from '@prisma/client';

export interface UserRepository {
  save(user: Prisma.UserCreateInput): Promise<User>;

  update(userId: number, user: Prisma.UserUpdateInput): Promise<User>;

  findByNickname(sender: string): Promise<User>;

  findByNicknameWithChannels(
    nickname: string,
  ): Promise<User & { channels?: Channel[] }>;

  findByNicknameWithChannelsAndBlockedUsers(
    nickname: string,
  ): Promise<User & { channels?: Channel[]; blockedUsers?: BlockedUser[] }>;
}
