import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { GenderEnum } from 'commom/enums';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;

  @IsNotEmpty()
  @IsString()
  contact!: string;

  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender!: GenderEnum;

  @IsNotEmpty()
  @IsNumber()
  age!: number;
}
