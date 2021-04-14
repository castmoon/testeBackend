import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Controller('product')
@UseGuards(AuthGuard())
export class ProductController {
  private logger = new Logger('ProductsController');
  constructor(private productService: ProductService) {}

  @Get()
  getProducts(
    @Query(ValidationPipe) filterDto: GetProductsFilterDto,
    @GetUser() user: User,
  ): Promise<Product[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.productService.getProducts(filterDto, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User,
  ): Promise<Product> {
    return this.productService.createProduct(createProductDto, user);
  }

  @Put(':id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User,
  ): Promise<Product> {
    return this.productService.updateProduct(id, updateProductDto, user);
  }

  @Delete(':id')
  deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.productService.deleteProduct(id, user);
  }
}
