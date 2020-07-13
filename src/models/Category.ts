import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import Transaction from './Transaction';

@Entity('categories')
class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('timestamp with time zone', { default: 'now()' })
  created_at: Date;

  @Column('timestamp with time zone', { default: 'now()' })
  updated_at: Date;

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[];
}

export default Category;
