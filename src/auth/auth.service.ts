import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { envs } from '../shared/env/envs';
@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService) {
    super();
  }
  onModuleInit() {
    this.$connect();
    this.logger.debug('Connected to the database');
  }

  async signJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const userFound = await this.user.findUnique({
        where: {
          email: registerUserDto.email,
        },
      });
      if (userFound) {
        throw new RpcException({
          status: 400,
          message: 'User already exists',
        });
      }

      const user = await this.user.create({
        data: {
          email: registerUserDto.email,
          name: registerUserDto.name,
          password: bcrypt.hashSync(registerUserDto.password, 10),
          cellPhone: registerUserDto.cellPhone,
        },
      });

      const { password: __, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token: await this.signJwtToken(userWithoutPassword),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const user = await this.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new RpcException({
          status: 400,
          message: 'Invalid credentials - email',
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new RpcException({
          status: 400,
          message: 'Invalid credentials - password',
        });
      }

      const { password: __, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        token: await this.signJwtToken(userWithoutPassword),
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async verifyUser(token: string) {
    try {
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: envs.JWT_SECRET,
      });

      return {
        user,
        token: await this.signJwtToken(user),
      };
    } catch (error) {
      throw new RpcException({
        status: 401,
        message: error.message,
      });
    }
  }
}
