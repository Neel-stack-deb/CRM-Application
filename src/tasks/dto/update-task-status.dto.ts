import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class UpdateTaskStatusDto {
  @ApiProperty({
    description: 'Task status to update',
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
  })
  @IsEnum(TaskStatus, { message: 'Status must be PENDING, IN_PROGRESS, or DONE' })
  @IsNotEmpty()
  status: TaskStatus;
}
