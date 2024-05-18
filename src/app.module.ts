import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';

import { Users } from './users/users.entity';
import { Product } from './product/product.entity';
import { CartProduct } from './cart/cart.entity';
import { LikedProduct } from './liked-product/liked-product.entity';
import { ProductCategory } from './product-category/product-category.entity';
import { Purchase } from './purchase/purchase.entity';

import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { LikedProductModule } from './liked-product/liked-product.module';
import { PurchaseModule } from './purchase/purchase.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'trumpet.db.elephantsql.com',
      port: 5432,
      username: 'qsyqrihd',
      password: '0CbW1eTypqsE_pkyWHVI_f5nCWi_gVnJ',
      database: 'qsyqrihd',
      entities: [
        Users,
        ProductCategory,
        Product,
        LikedProduct,
        CartProduct,
        Purchase,
      ],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    AuthModule,
    ProductModule,
    ProductCategoryModule,
    LikedProductModule,
    CartModule,
    PurchaseModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
