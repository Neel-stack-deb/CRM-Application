import { Controller, Get, Param, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all users (Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'EMPLOYEE',
          createdAt: '2024-01-20T10:30:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only admins can access this endpoint',
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Returns a single user by their ID (Admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'EMPLOYEE',
        createdAt: '2024-01-20T10:30:00.000Z',
        updatedAt: '2024-01-20T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only admins can access this endpoint',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update user role',
    description: 'Updates the role of a user (Admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User role updated successfully',
    schema: {
      example: {
        message: 'User role updated successfully',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'ADMIN',
          createdAt: '2024-01-20T10:30:00.000Z',
          updatedAt: '2024-01-20T10:35:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only admins can access this endpoint',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateRole(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateRole(id, updateUserDto);
  }
}
