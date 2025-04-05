import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './user.dto';

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
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // const { name, email, age } = createUserDto;
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
    type: [CreateUserDto],
  })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
