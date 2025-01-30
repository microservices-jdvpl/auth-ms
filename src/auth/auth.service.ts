import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RegisterUserDto } from './dto/register-user.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private logger = new Logger(AuthService.name);

  onModuleInit() {
    this.$connect();
    this.logger.debug('Connected to the database');
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
          password: registerUserDto.password,
          name: registerUserDto.name,
          cellPhone: registerUserDto.cellPhone,
        },
      });
      return { user, token: user.id };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
