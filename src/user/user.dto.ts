import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsInt, Min, Max } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Name of the user', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Age of the user', example: 30 })
  @IsInt()
  @Min(18)
  @Max(120)
  age: number;

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

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'Role of the user',
    example: 'admin',
  })
  @IsString()
  role: string;
}
