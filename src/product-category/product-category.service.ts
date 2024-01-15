import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ProductCategory } from './product-category.entity';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async create(body: CreateProductCategoryDto) {
    const productCategory = this.productCategoryRepository.create({ ...body });
    return await this.productCategoryRepository.save(productCategory);
  }

  async findAll() {
    return await this.productCategoryRepository.find();
  }

  async delete(id: string) {
    const productCategory = await this.productCategoryRepository.findOne({
      where: { id },
    });

    if (!productCategory) {
      throw new Error('Product category not found');
    }

    return await this.productCategoryRepository.remove(productCategory);
  }
}