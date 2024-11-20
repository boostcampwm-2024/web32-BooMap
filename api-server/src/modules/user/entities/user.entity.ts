import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Mindmap } from '.';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  type: string;

  @CreateDateColumn({ type: 'timestamp', name: 'create_date' })
  createDate: Date;

  @OneToMany(() => Mindmap, (mindmap) => mindmap.user)
  mindmaps: Mindmap[];
}
