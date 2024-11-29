import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './enum/role.enum';
import { User } from './user.entity';
import { Mindmap } from './mindmap.entity';

@Entity('user_mindmap_role')
export class UserMindmapRole {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userMindmapRoles, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Mindmap, (mindmap) => mindmap.userMindmapRoles, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'mindmap_id' })
  mindmap: Mindmap;

  @Column({ type: 'enum', enum: Role, default: Role.OWNER })
  role: Role;

  @DeleteDateColumn()
  deleteAt: Date | null;
}
