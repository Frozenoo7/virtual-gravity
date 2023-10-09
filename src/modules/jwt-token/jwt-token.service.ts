import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PayloadDto } from 'auth/dtos';
import { ConfigurationService } from 'configuration/configuration.service';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly configService: ConfigurationService,
    private readonly jwtService: JwtService,
  ) {}

  generateAccessToken(payload: PayloadDto): { accessToken: string } {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.jwtSecret,
      expiresIn: '30d',
    });

    return { accessToken };
  }
}
