import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new task',
    description: 'Creates a new task and assigns it to an employee (Admin only)',
  })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    schema: {
      example: {
        message: 'Task created successfully',
        task: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Follow up with client',
          description: 'Schedule a meeting to discuss project requirements',
          status: 'PENDING',
          assignedTo: '123e4567-e89b-12d3-a456-426614174001',
          customerId: '123e4567-e89b-12d3-a456-426614174002',
          createdAt: '2024-01-20T10:30:00.000Z',
          updatedAt: '2024-01-20T10:30:00.000Z',
          user: {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'EMPLOYEE',
          },
          customer: {
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Acme Corporation',
            email: 'contact@acme.com',
            phone: '+1234567890',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed or assigned user is not an EMPLOYEE',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only admins can create tasks',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Customer or assigned user not found',
  })
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({
    summary: 'Get all tasks',
    description: 'Returns all tasks for ADMIN, or only assigned tasks for EMPLOYEE',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks retrieved successfully',
    schema: {
      example: [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Follow up with client',
          description: 'Schedule a meeting to discuss project requirements',
          status: 'PENDING',
          assignedTo: '123e4567-e89b-12d3-a456-426614174001',
          customerId: '123e4567-e89b-12d3-a456-426614174002',
          createdAt: '2024-01-20T10:30:00.000Z',
          updatedAt: '2024-01-20T10:30:00.000Z',
          user: {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'EMPLOYEE',
          },
          customer: {
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Acme Corporation',
            email: 'contact@acme.com',
            phone: '+1234567890',
          },
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
    description: 'Forbidden - Insufficient permissions',
  })
  findAll(@GetUser('userId') userId: string, @GetUser('role') userRole: Role) {
    return this.tasksService.findAll(userId, userRole);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @ApiOperation({
    summary: 'Update task status',
    description: 'Updates the status of a task. EMPLOYEE can only update their own tasks.',
  })
  @ApiParam({
    name: 'id',
    description: 'Task UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Task status updated successfully',
    schema: {
      example: {
        message: 'Task status updated successfully',
        task: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Follow up with client',
          description: 'Schedule a meeting to discuss project requirements',
          status: 'IN_PROGRESS',
          assignedTo: '123e4567-e89b-12d3-a456-426614174001',
          customerId: '123e4567-e89b-12d3-a456-426614174002',
          createdAt: '2024-01-20T10:30:00.000Z',
          updatedAt: '2024-01-20T10:35:00.000Z',
          user: {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'John Doe',
            email: 'john.doe@example.com',
            role: 'EMPLOYEE',
          },
          customer: {
            id: '123e4567-e89b-12d3-a456-426614174002',
            name: 'Acme Corporation',
            email: 'contact@acme.com',
            phone: '+1234567890',
          },
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
    description: 'Forbidden - EMPLOYEE trying to update someone else\'s task',
  })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
  })
  updateStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser('userId') userId: string,
    @GetUser('role') userRole: Role,
  ) {
    return this.tasksService.updateStatus(id, updateTaskStatusDto, userId, userRole);
  }
}
