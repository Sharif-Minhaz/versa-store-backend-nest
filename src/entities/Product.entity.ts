import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  Index,
} from 'typeorm';
import Category from './Category.entity';
import Vendor from './Vendor.entity';
import Bookmark from './Bookmark.entity';
import ProductImage from './ProductImage.entity';
import ProductVariant from './ProductVariant.entity';
import Review from './Review.entity';

@Entity()
export default class Product {
  @PrimaryGeneratedColumn()
  _id: number;

  @ManyToOne(() => Vendor, (vendor) => vendor.products)
  addedBy: Vendor;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @ManyToMany(() => Bookmark, (bookmark) => bookmark.product)
  bookmarks: Bookmark[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Column()
  name: string;

  @Column({ type: 'float', default: 1.0 })
  price: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'float', default: 0.0 })
  discount: number;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  images: ProductImage[];

  @Column()
  brand: string;

  @Column({ type: 'int', default: 1 })
  stock: number;

  @Column({ type: 'int', default: 0 })
  sold: number;

  @Column()
  defaultType: string;

  @Column({ type: 'float', default: 50.0 })
  deliveryCharge: number;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'tsvector', select: false, nullable: true }) // Optional: Don't fetch by default
  @Index({ fulltext: true }) // ! FIXME: only works for mySQL not in postgres
  searchVector: string;
}
