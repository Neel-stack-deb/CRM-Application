import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const { name, email, phone, company } = createCustomerDto;

    // Check for existing email
    const existingEmail = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check for existing phone
    const existingPhone = await this.prisma.customer.findUnique({
      where: { phone },
    });

    if (existingPhone) {
      throw new ConflictException('Phone number already exists');
    }

    // Create customer
    const customer = await this.prisma.customer.create({
      data: {
        name,
        email,
        phone,
        company,
      },
    });

    return {
      message: 'Customer created successfully',
      customer,
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { company: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    // Get total count
    const totalRecords = await this.prisma.customer.count({ where });

    // Get paginated customers
    const customers = await this.prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      page,
      limit,
      totalRecords,
      totalPages,
      data: customers,
    };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    // Check if customer exists
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Check for email conflict if email is being updated
    if (updateCustomerDto.email && updateCustomerDto.email !== existingCustomer.email) {
      const emailExists = await this.prisma.customer.findUnique({
        where: { email: updateCustomerDto.email },
      });

      if (emailExists) {
        throw new ConflictException('Email already exists');
      }
    }

    // Check for phone conflict if phone is being updated
    if (updateCustomerDto.phone && updateCustomerDto.phone !== existingCustomer.phone) {
      const phoneExists = await this.prisma.customer.findUnique({
        where: { phone: updateCustomerDto.phone },
      });

      if (phoneExists) {
        throw new ConflictException('Phone number already exists');
      }
    }

    // Update customer
    const updatedCustomer = await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });

    return {
      message: 'Customer updated successfully',
      customer: updatedCustomer,
    };
  }

  async remove(id: string) {
    // Check if customer exists
    const existingCustomer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    // Delete customer
    await this.prisma.customer.delete({
      where: { id },
    });

    return {
      message: 'Customer deleted successfully',
    };
  }
}
