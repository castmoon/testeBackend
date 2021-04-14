import {
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { Product } from './product.entity';

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  private logger = new Logger('ProductRepository');
  async getProducts(
    filterDto: GetProductsFilterDto,
    user: User,
  ): Promise<Product[]> {
    const { title, category } = filterDto;
    const query = this.createQueryBuilder('product');

    query.where('product.userId = :userId', { userId: user.id });
    if (title) {
      query.andWhere('product.title = :title', { title });
    }

    if (category) {
      query.andWhere('product.category = :category', { category });
    }

    try {
      const products = await query.getMany();
      if (products.length === 0) {
        this.logger.error(`Failed to get products for User "${user.username}"`);
        throw new NotFoundException(`Products not found`);
      }
      return products;
    } catch (e) {
      this.logger.error(
        `Failed to get products for User "${
          user.username
        }", Filters: ${JSON.stringify(filterDto)}`,
      );
      throw new InternalServerErrorException();
    }
  }

  async createProduct(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const { title, description, price, category } = createProductDto;
    const product = new Product();
    product.title = title;
    product.description = description;
    product.price = price;
    product.category = category;
    product.user = user;
    try {
      await product.save();
    } catch (e) {
      this.logger.error(
        `Failed to create a task for user "${user.username}", Data: ${createProductDto}`,
      );
      throw new InternalServerErrorException();
    }
    delete product.user;
    return product;
  }
}
