import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  registerUser(@Payload() createUsertDto: any) {
    console.log(createUsertDto);
    return 'register';
  }
  @MessagePattern('auth.login.user')
  loginUser(@Payload() createUsertDto: any) {
    console.log(createUsertDto);
    return 'login';
  }
  @MessagePattern('auth.verify.user')
  verifyUser(@Payload() createUsertDto: any) {
    console.log(createUsertDto);
    return 'verify';
  }
}
