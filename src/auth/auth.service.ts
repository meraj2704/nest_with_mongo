import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginResponseDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<LoginResponseDto> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    console.log('user', user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    const payload = { email: user.email, sub: user._id };
    console.log('payload from auth service', payload);
    const signInData = this.jwtService.sign(payload);

    const userData = {
      _id: user._id as string,
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
      token: signInData,
    };
    console.log('signin data', signInData);
    return userData;
  }
}
