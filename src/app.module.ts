import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatController } from './infra/http/controller/chat/chat.controller';
import { ChatUseCaseImplService } from './app/usecase/chat-use-case/chat-use-case-impl.service';
import { UserRepositoryImplService } from './infra/persistence/repository/user-repository-impl/user-repository-impl.service';

@Module({
  imports: [],
  controllers: [AppController, ChatController],
  providers: [
    AppService,
    { provide: 'ChatUseCase', useClass: ChatUseCaseImplService },
    { provide: 'UserRepository', useClass: UserRepositoryImplService },
  ],
})
export class AppModule {}
