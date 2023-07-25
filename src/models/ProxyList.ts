import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn, } from "typeorm";

@Entity()
export class ProxyList {
    @PrimaryGeneratedColumn()
    Id: number

    @Column()
    Host: string

    @Column()
    Port: number

    @Column()
    Login: string

    @Column()
    Password: string
}