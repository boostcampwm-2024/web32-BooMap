import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Mindmap } from './mindmap.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  name: string;

  @Column({ type: 'varchar', length: 32 })
  email: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_date' })
  createDate: Date;

  @OneToMany(() => Mindmap, (mindmap) => mindmap.user)
  mindmaps: Mindmap[];
}
