import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserDocument } from 'database/models';
import { JwtTokenService } from 'jwtToken/jwt-token.service';
import { UserService } from 'user/user.service';

import { IAuthResponse } from './responses';
import { LoginDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async validateUser({
    email,
    password,
  }: LoginDto): Promise<UserDocument | null> {
    const user = await this.userService.findUserByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;

      return user;
    }

    return null;
  }

  async login(user: UserDocument): Promise<IAuthResponse> {
    const { _id } = user;

    const payload = { _id };

    const { accessToken } = this.jwtTokenService.generateAccessToken(payload);

    return {
      id: _id,
      accessToken,
    };
  }
}
