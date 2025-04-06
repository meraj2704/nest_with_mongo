import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './user.dto';
import { CustomApiResponse } from 'src/response/response.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUserDto,
    description: 'User data to be created',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto;
      const existingUser = await this.userService.findOneByEmail(email);
      if (existingUser) {
        return new CustomApiResponse(
          400,
          'User with this email already exists',
        );
      }
      const user = await this.userService.create(createUserDto);
      return new CustomApiResponse(201, 'User created successfully', user);
    } catch (error) {
      return new CustomApiResponse(
        500,
        'Failed to create user',
        null,
        error.message,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [CreateUserDto],
  })
  async findAll() {
    try {
      const users = await this.userService.findAll();
      return new CustomApiResponse(200, 'Users fetched successfully', users);
    } catch (error) {
      return new CustomApiResponse(
        500,
        'Failed to fetch users',
        null,
        error.message,
      );
    }
  }
}
