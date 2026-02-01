import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({
    description: 'Task title',
    example: 'Follow up with client',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Schedule a meeting to discuss project requirements',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'User ID to assign the task to (must be an EMPLOYEE)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  assignedTo: string;

  @ApiProperty({
    description: 'Customer ID associated with the task',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    example: TaskStatus.PENDING,
    default: TaskStatus.PENDING,
    required: false,
  })
  @IsEnum(TaskStatus, { message: 'Status must be PENDING, IN_PROGRESS, or DONE' })
  @IsOptional()
  status?: TaskStatus;
}
