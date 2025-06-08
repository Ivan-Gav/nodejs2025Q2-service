import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

// export interface User {
//   id: string; // uuid v4
//   login: string;
//   password: string;
//   version: number; // integer number, increments on update
//   createdAt: number; // timestamp of creation
//   updatedAt: number; // timestamp of last update
// }

export interface CreateUserDto {
  login: string;
  password: string;
}

export interface UpdatePasswordDto {
  oldPassword: string; // previous password
  newPassword: string; // new password
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  login: string;

  @Column()
  password: string; // hashing is executed in service

  @VersionColumn({ default: 1 })
  version: number;

  @CreateDateColumn({
    type: 'bigint',
    default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000',
  })
  createdAt: number;

  @UpdateDateColumn({
    type: 'bigint',
    default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000',
  })
  updatedAt: number;
}
