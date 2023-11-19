import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserRepositoryImplService } from './user-repository-impl.service';

describe('UserRepositoryImplService', () => {
  let repository: UserRepositoryImplService;
  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_TEST_URL,
        },
      },
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryImplService,
        { provide: 'PrismaClient', useValue: prisma },
      ],
    }).compile();

    repository = module.get<UserRepositoryImplService>(
      UserRepositoryImplService,
    );
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it('should save a user to the db', async () => {
    const player = {
      login: 'marvin',
      nickname: 'mmarvin',
      avatarUrl: 'http://',
    };
    const user = await repository.save(player);

    expect(user).toHaveProperty('id');
    expect(user.login).toBe('marvin');
    expect(user.nickname).toBe('mmarvin');
    expect(user.avatarUrl).toBe('http://');
  });

  it('should update a user', async () => {
    const player = {
      login: 'Zaphod',
      nickname: 'mmarvinho',
      avatarUrl: 'http://',
    };
    const user = await repository.save(player);
    const updatedUser = await repository.update(user.id, {
      nickname: 'mmarvin2',
      avatarUrl: 'http://42.fr',
    });

    expect(updatedUser).toHaveProperty('id');
    expect(updatedUser.login).toBe('Zaphod');
    expect(updatedUser.nickname).toBe('mmarvin2');
    expect(updatedUser.avatarUrl).toBe('http://42.fr');
  });

  it('should enable tfa for a user', async () => {
    const player = {
      login: 'Zaphod',
      nickname: 'mmarvinho',
      avatarUrl: 'http://',
    };
    const user = await repository.save(player);
    const updatedUser = await repository.update(user.id, {
      tfaEnabled: true,
      tfaSecret: 'secret',
    });

    expect(updatedUser).toHaveProperty('id');
    expect(updatedUser.login).toBe('Zaphod');
    expect(updatedUser.nickname).toBe('mmarvinho');
    expect(updatedUser.avatarUrl).toBe('http://');
    expect(updatedUser.tfaEnabled).toBe(true);
    expect(updatedUser.tfaSecret).toBe('secret');
  });

  it('should find a user by nickname', async () => {
    const player = {
      login: 'marvin',
      nickname: 'mmarvin',
      avatarUrl: 'http://',
    };
    await repository.save(player);
    const user = await repository.findByNickname('mmarvin');

    expect(user).toHaveProperty('id');
    expect(user.login).toBe('marvin');
    expect(user.nickname).toBe('mmarvin');
    expect(user.avatarUrl).toBe('http://');
    console.log(user);
  });
});
