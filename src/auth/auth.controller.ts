import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto, RefreshTokenDto } from './auth.dto';
import { CustomApiResponse } from 'src/response/response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiOperation({ summary: 'Login a user and return JWT token' }) //
  @ApiBody({
    description: 'User login credentials',
    type: AuthDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, JWT token returned',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '60d5f484f1a2c8b8f8e4b8c8' },
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'test@email.com' },
        age: { type: 'number', example: 30 },
        role: { type: 'string', example: 'user' },
        access_token: { type: 'string', example: 'your-jwt-token' },
        refresh_token: { type: 'string', example: 'your-jwt-token' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() authDto: AuthDto) {
    const { email, password } = authDto;
    const user = await this.authService.login(email, password);
    console.log('user ', user);
    return new CustomApiResponse(200, 'Login successful', user);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiBody({
    description: 'Refresh token',
    type: RefreshTokenDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  async refreshToken(@Body('refresh_token') refresh_token: string) {
    console.log('refresh_token', refresh_token);
    const newAccessToken =
      await this.authService.refreshAccessToken(refresh_token);
    console.log('newAccessToken', newAccessToken);
    if (newAccessToken) {
      return new CustomApiResponse(200, 'Token refreshed successfully', {
        access_token: newAccessToken,
      });
    }
    return new CustomApiResponse(
      401,
      'Invalid refresh token',
      null,
      'Invalid refresh token',
    );
  }
}
