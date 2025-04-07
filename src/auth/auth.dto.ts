import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
  })
  @IsString()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '60d5f484f1a2c8b8f8e4b8c8',
  })
  _id: string;
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  name: string;
  @ApiProperty({
    description: 'Email of the user',
    example: 'example@gmail.com',
  })
  email: string;
  @ApiProperty({
    description: 'Age of the user',
    example: 30,
  })
  age: number;
  @ApiProperty({
    description: 'Role of the user',
    example: 'user',
  })
  role: string;
  @ApiProperty({
    description: 'JWT token for authentication',
    example: 'your-jwt-token',
  })
  token: string;
}
