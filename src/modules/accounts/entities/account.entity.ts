import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IAccountModel } from '../models/account.struct';

@Entity('accounts')
export class AccountEntity implements IAccountModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'access_token', nullable: true })
  accessToken?: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;
}
