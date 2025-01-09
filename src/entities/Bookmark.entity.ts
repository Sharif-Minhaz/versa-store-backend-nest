import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './Customer.entity';
import { Product } from './Product.entity';

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn()
  _id: number;

  @ManyToOne(() => Customer, (customer) => customer.bookmarks)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ManyToOne(() => Product, (product) => product.bookmarks)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
