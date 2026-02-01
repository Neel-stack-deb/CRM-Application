import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User role to update',
    enum: Role,
    example: Role.ADMIN,
  })
  @IsEnum(Role, { message: 'Role must be either ADMIN or EMPLOYEE' })
  @IsNotEmpty()
  role: Role;
}
