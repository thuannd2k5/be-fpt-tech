import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CoursesModule } from './courses/courses.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { LeadsModule } from './leads/leads.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import MongooseDelete from 'mongoose-delete';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          connection.plugin(MongooseDelete, {
            overrideMethods: 'all',
            deletedAt: true
          });
          return connection;
        }
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(
      {
        isGlobal: true,
        envFilePath: '.env',
      }
    ),
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    CoursesModule,
    ClassroomsModule,
    LeadsModule,
    EnrollmentsModule,
    InvoicesModule,
    PaymentsModule,
    NotificationsModule,
    ConversationsModule,
    MessagesModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule { }
