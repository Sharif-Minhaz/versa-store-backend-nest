import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  image: string;

  @Column()
  imageKey: string;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
