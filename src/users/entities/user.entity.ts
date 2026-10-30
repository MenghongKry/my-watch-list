import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  // Never sent back in a response (ClassSerializerInterceptor removes it)
  @Column()
  @Exclude()
  passwordHash: string;
}
