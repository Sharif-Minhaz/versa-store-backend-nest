import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Admin {
  @PrimaryGeneratedColumn()
  _id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'https://randomuser.me/api/portraits/lego/7.jpg' })
  image: string;

  @Column({ nullable: true })
  imageKey: string;

  @Column({ default: 'admin' })
  user_type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
