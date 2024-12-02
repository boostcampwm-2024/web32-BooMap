import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserMindmapRole } from './user.mindmap.role';

@Entity('user')
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

  @OneToMany(() => UserMindmapRole, (userMindmapRole) => userMindmapRole.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userMindmapRoles: UserMindmapRole[];
}
