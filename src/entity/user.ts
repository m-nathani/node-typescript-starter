import { Entity, Column, PrimaryGeneratedColumn, Unique, PrimaryColumn } from 'typeorm';
import { Length, IsEmail, IsIn } from 'class-validator';
import { userType } from '../constant';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        unique: true,
    })
    nic: string;

    @Column({
        length: 80,
        nullable: false
    })
    firstName: string;

    @Column({
        length: 80,
        nullable: false
    })
    lastName: string;

    @Column({
        length: 100,
        unique: true,
        nullable: false
    })
    @IsEmail()
    email: string;

    @Column({
        nullable: false,
        select: false
    })
    password: string;

    @Column({
        length: 20,
        nullable: false
    })
    gender: string;

    @Column({
        nullable: false,
    })
    @IsIn([userType.government, userType.public])
    userType: number;

    @Column({
        nullable: true,
    })
    designation: string;
}