import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto } from './dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Customers')
@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new customer',
    description: 'Creates a new customer record (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    schema: {
      example: {
        message: 'Customer created successfully',
        customer: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Acme Corporation',
          email: 'contact@acme.com',
          phone: '+1234567890',
          company: 'Acme Inc.',
          createdAt: '2024-01-20T10:30:00.000Z',
          updatedAt: '2024-01-20T10:30:00.000Z',
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
    description: 'Forbidden - Only admins can create customers',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email or phone already exists',
  })
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({
    summary: 'Get all customers',
    description: 'Returns a paginated list of customers (Admin + Employee)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for filtering by name, email, or company',
  })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
    schema: {
      example: {
        page: 1,
        limit: 10,
        totalRecords: 25,
        totalPages: 3,
        data: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Acme Corporation',
            email: 'contact@acme.com',
            phone: '+1234567890',
            company: 'Acme Inc.',
            createdAt: '2024-01-20T10:30:00.000Z',
            updatedAt: '2024-01-20T10:30:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.customersService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({
    summary: 'Get customer by ID',
    description: 'Returns a single customer by their ID (Admin + Employee)',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer retrieved successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1234567890',
        company: 'Acme Inc.',
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
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Update customer',
    description: 'Updates customer details (Admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer updated successfully',
    schema: {
      example: {
        message: 'Customer updated successfully',
        customer: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Acme Corporation',
          email: 'contact@acme.com',
          phone: '+1234567890',
          company: 'Acme Inc.',
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
    description: 'Forbidden - Only admins can update customers',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email or phone already exists',
  })
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Delete customer',
    description: 'Deletes a customer by ID (Admin only)',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer deleted successfully',
    schema: {
      example: {
        message: 'Customer deleted successfully',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only admins can delete customers',
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
