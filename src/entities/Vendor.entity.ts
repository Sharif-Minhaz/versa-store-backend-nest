import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import Bookmark from './Bookmark.entity';
import Product from './Product.entity';

@Entity()
export default class Vendor {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ enum: ['google', 'form'], default: 'form' })
  loginMethod: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'text',
    default: 'https://randomuser.me/api/portraits/lego/5.jpg',
  })
  image: string;

  @Column({ nullable: true })
  imageKey: string;

  @Column()
  shopName: string;

  @Column({ unique: true })
  shopLicenseNo: string;

  @Column()
  shopType: string;

  @Column()
  shopPhoto: string;

  @Column({ nullable: true })
  shopPhotoKey: string;

  @Column()
  shopAddress: string;

  @Column({ default: false })
  isBan: boolean;

  @Column({ default: 'vendor' })
  user_type: string;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.customer)
  bookmarks: Bookmark[];

  @OneToMany(() => Product, (product) => product.addedBy)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
