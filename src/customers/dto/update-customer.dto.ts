import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'Acme Corporation',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'contact@acme.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Customer company name',
    example: 'Acme Inc.',
    required: false,
  })
  @IsString()
  @IsOptional()
  company?: string;
}
