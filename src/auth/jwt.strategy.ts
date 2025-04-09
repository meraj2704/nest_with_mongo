import { UserService } from 'src/user/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { CustomApiResponse } from 'src/response/response.dto';
import { CustomApiResponse } from '../response/response.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'nest-with-mongodb',
    });
  }

  async validate(payload: any) {
    const { sub, email } = payload;

    console.log('payload', payload);
    if (!sub || !email) {
      return new CustomApiResponse(
        401,
        'Unauthorized',
        null,
        'Invalid token payload',
      );
    }

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    return { userId: sub, email: user.email, role: user.role };
  }
}
