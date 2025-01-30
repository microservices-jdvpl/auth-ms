import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  registerUser(@Payload() createUsertDto: RegisterUserDto) {
    return this.authService.registerUser(createUsertDto);
  }
  @MessagePattern('auth.login.user')
  loginUser(@Payload() loginUsertDto: LoginUserDto) {
    return loginUsertDto;
  }
  @MessagePattern('auth.verify.user')
  verifyUser(@Payload() createUsertDto: any) {
    console.log(createUsertDto);
    return 'verify';
  }
}
