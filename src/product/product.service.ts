import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
  ) {}

  getProducts(filterDto: GetProductsFilterDto, user: User): Promise<Product[]> {
    return this.productRepository.getProducts(filterDto, user);
  }

  createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    return this.productRepository.createProduct(createProductDto, user);
  }

  async getProductById(id: number, user: User): Promise<Product> {
    const found = await this.productRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return found;
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
    user: User,
  ): Promise<Product> {
    const product = await this.getProductById(id, user);
    const { title, description, category, price } = updateProductDto;
    product.title = title;
    product.description = description;
    product.category = category;
    product.price = price;

    await product.save();
    return product;
  }

  async deleteProduct(id: number, user: User): Promise<void> {
    const deletedProduct = await this.productRepository.delete({
      id,
      userId: user.id,
    });

    if (deletedProduct.affected === 0) {
      throw new BadRequestException(`Cannot delete product with ${id}`);
    }
  }
}
