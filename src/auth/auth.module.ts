import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { SessionsModule } from '../sessions/sessions.module';
import { AccessTokenGuard } from './guards/auth.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessTokenGuard],
  imports: [TypeOrmModule.forFeature([User]), JwtModule, SessionsModule],
})
export class AuthModule {}
