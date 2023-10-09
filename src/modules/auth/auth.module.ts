import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigurationModule } from 'configuration/configuration.module';
import { UserSchema } from 'database/models';
import { JwtTokenModule } from 'jwtToken/jwt-token.module';
import { UserModule } from 'user/user.module';
import { UserService } from 'user/user.service';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtTokenModule,
    ConfigurationModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    ConfigService,
    UserService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
