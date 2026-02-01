import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Role } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const { title, description, assignedTo, customerId, status } = createTaskDto;

    // Verify that the assigned user exists and is an EMPLOYEE
    const assignedUser = await this.prisma.user.findUnique({
      where: { id: assignedTo },
    });

    if (!assignedUser) {
      throw new NotFoundException(`User with ID ${assignedTo} not found`);
    }

    if (assignedUser.role !== Role.EMPLOYEE) {
      throw new BadRequestException('Tasks can only be assigned to users with EMPLOYEE role');
    }

    // Verify that the customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${customerId} not found`);
    }

    // Create the task
    const task = await this.prisma.task.create({
      data: {
        title,
        description,
        assignedTo,
        customerId,
        status: status || 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return {
      message: 'Task created successfully',
      task,
    };
  }

  async findAll(userId: string, userRole: Role) {
    // ADMIN can see all tasks, EMPLOYEE can only see their assigned tasks
    const where = userRole === Role.ADMIN ? {} : { assignedTo: userId };

    const tasks = await this.prisma.task.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks;
  }

  async updateStatus(
    taskId: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    userId: string,
    userRole: Role,
  ) {
    const { status } = updateTaskStatusDto;

    // Find the task
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // EMPLOYEE can only update their own tasks
    if (userRole === Role.EMPLOYEE && task.assignedTo !== userId) {
      throw new ForbiddenException('You can only update tasks assigned to you');
    }

    // Update the task status
    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return {
      message: 'Task status updated successfully',
      task: updatedTask,
    };
  }
}
