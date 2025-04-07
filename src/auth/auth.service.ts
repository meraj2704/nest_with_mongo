import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
          data: null,
          error: 'Invalid email or password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    console.log('user', user);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials',
          data: null,
          error: 'Invalid email or password',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = { email: user.email, sub: user._id };
    console.log('payload from auth service', payload);
    const access_token = this.jwtService.sign(payload, { expiresIn: '2m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '1m' });

    const updatedUser = await this.userService.findByIdAndUpdateRefreshToken(
      user._id as string,
      refresh_token,
    );

    console.log('updated user', updatedUser);

    const userData = {
      _id: user._id as string,
      name: user.name,
      email: user.email,
      age: user.age,
      role: user.role,
      access_token: access_token,
      refresh_token: refresh_token,
    };
    console.log('signin data', access_token);
    return userData;
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      console.log('decoded', decoded);

      const user = await this.userService.findOneByEmail(decoded.email);

      console.log('user', user);
      if (!user || user.refreshToken !== refreshToken) {
        throw new HttpException(
          'Invalid refresh token',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const payload = { email: user.email, sub: user._id };
      const newAccessToken = this.jwtService.sign(payload, { expiresIn: '2m' });
      return newAccessToken;
    } catch (err) {
      console.log('Error in refreshAccessToken', err);
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
