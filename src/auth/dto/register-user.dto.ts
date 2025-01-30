import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  name: string;

  @IsPhoneNumber()
  cellPhone: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
