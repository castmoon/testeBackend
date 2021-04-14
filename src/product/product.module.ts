import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository]), AuthModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
