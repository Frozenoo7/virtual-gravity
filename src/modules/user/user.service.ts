import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { hash } from 'bcrypt';

import { IAuthResponse } from 'auth/responses';
import { UserDocument } from 'database/models';
import { JwtTokenService } from 'jwtToken/jwt-token.service';

import { ISuccessResponse } from 'commom/responses';

import { CreateUserDto } from './dtos';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  public async createUser(body: CreateUserDto): Promise<IAuthResponse> {
    const { name, email, password, gender, contact, age } = body;

    await this.checkForExistingEmail(email);
    const hashedPassword = await hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      gender,
      contact,
      age,
    });
    const { _id } = user;

    const { accessToken } = this.jwtTokenService.generateAccessToken({
      _id,
    });

    return {
      id: _id,
      accessToken,
    };
  }

  public async updateUser(
    id: string,
    body: Omit<CreateUserDto, 'password'>,
  ): Promise<ISuccessResponse> {
    const { name, email, age, contact, gender } = body;

    const user = await this.userModel.findById(id);

    if (user.email.toLowerCase() !== email.toLowerCase()) {
      await this.checkForExistingEmail(email);
    }

    await this.userModel.findByIdAndUpdate(id, {
      $set: {
        name,
        email,
        age,
        contact,
        gender,
      },
    });

    return { message: 'User updated successfully.' };
  }

  public async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  public async findUserById(_id: string) {
    return await this.userModel.findOne({ _id });
  }

  private async checkForExistingEmail(email: string) {
    const existingUser = await this.userModel.findOne({ email });

    if (existingUser) {
      throw new ConflictException(
        'User already exists with the same email.Please choose a different email.',
      );
    }
  }
}
