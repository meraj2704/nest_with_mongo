import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiOperation({ summary: 'Login a user and return JWT token' }) // Operation description for Swagger UI
  @ApiBody({
    description: 'User login credentials', // Description of request body
    type: AuthDto, // Use the AuthDto class for the body
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, JWT token returned',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'your-jwt-token' }, // Example of the JWT token response
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials', // Invalid login case
  })
  async login(@Body() authDto: AuthDto) {
    const { email, password } = authDto; // Destructure email and password from the DTO
    return this.authService.login(email, password); // Call the login method from AuthService
  }
}
