import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './Product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  _id: number;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  imageKey: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
