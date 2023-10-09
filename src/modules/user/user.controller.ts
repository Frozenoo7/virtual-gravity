import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'auth/guards';

import { UserService } from './user.service';
import { CreateUserDto } from './dtos';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async createUser(@Body() body: CreateUserDto) {
    return await this.userService.createUser(body);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  public async updateUser(
    @Body() body: Omit<CreateUserDto, 'password'>,
    @Req() req,
  ) {
    const userId = req.user._id;
    return await this.userService.updateUser(userId, body);
  }
}
