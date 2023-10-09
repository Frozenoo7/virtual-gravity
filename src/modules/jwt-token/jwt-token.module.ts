import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { ConfigurationService } from 'configuration/configuration.service';

import { JwtTokenService } from './jwt-token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigurationService],
      useFactory: async (configService: ConfigurationService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '30d' },
      }),
    }),
  ],
  providers: [JwtTokenService, JwtService],
  exports: [JwtTokenService],
})
export class JwtTokenModule {}
