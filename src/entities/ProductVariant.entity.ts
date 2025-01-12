import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Product from './Product.entity';

@Entity()
export default class ProductVariant {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  type: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  price: number;

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;
}
