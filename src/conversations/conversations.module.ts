import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './schemas/conversation.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Role, RoleSchema } from '../roles/schemas/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
})
export class ConversationsModule {}
