import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserRoleDto } from './user.dto';
import { CustomApiResponse } from '../response/response.dto';
import { Roles } from '../common/guards/roles.decorate';
import { UserRole } from './user-role.enum';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Users')
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

  @Put('role-update/:userId')
  @ApiOperation({ summary: 'Update user role' })
  @ApiBody({
    type: UpdateUserRoleDto,
    description: 'New role for the user',
  })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
  })
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateRole(
    @Param('userId') userId: string,
    @Body('role') newRole: string,
  ) {
    try {
      const updatedUser = await this.userService.updateUserRole(
        userId,
        newRole,
      );
      return new CustomApiResponse(
        200,
        'User role updated successfully',
        updatedUser,
      );
    } catch (error) {
      return new CustomApiResponse(
        500,
        'Failed to update user role',
        null,
        error.message,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Roles(UserRole.SUPER_ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string) {
    try {
      const deletedUser = await this.userService.delete(id);
      if (!deletedUser) {
        return new CustomApiResponse(404, 'User not found');
      }
      return new CustomApiResponse(200, 'User deleted successfully');
    } catch (error) {
      return new CustomApiResponse(
        500,
        'Failed to delete user',
        null,
        error.message,
      );
    }
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile fetched successfully',
  })
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const userId = req.user.userId;
    console.log('req', req.user);
    try {
      const userProfile = await this.userService.getProfile(userId);
      return new CustomApiResponse(
        200,
        'User profile fetched successfully',
        userProfile,
      );
    } catch (error) {
      return new CustomApiResponse(
        500,
        'Failed to fetch user profile',
        null,
        error.message,
      );
    }
  }
}
