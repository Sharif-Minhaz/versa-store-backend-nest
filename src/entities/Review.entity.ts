import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import Product from './Product.entity';
import Vendor from './Vendor.entity';
import Admin from './Admin.entity';
import Customer from './Customer.entity';

@Entity()
export default class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  review: string;

  @ManyToOne(() => Vendor, { nullable: true })
  vendor: Vendor;

  @ManyToOne(() => Admin, { nullable: true })
  admin: Admin;

  @ManyToOne(() => Customer, { nullable: true })
  customer: Customer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
