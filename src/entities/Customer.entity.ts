import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Bookmark } from './Bookmark.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ enum: ['google', 'form'], default: 'google' })
  loginMethod: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    default: 'https://randomuser.me/api/portraits/lego/5.jpg',
  })
  image: string;

  @Column({ nullable: true })
  imageKey: string;

  @Column({ default: false })
  isBan: boolean;

  @Column({ default: 'customer' })
  user_type: string;

  @OneToMany(() => Bookmark, (bookmark) => bookmark.customer)
  bookmarks: Bookmark[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
