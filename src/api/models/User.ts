import * as bcrypt from "bcrypt";
import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator";
import {
    BeforeInsert,
    Column,
    Entity,
    ObjectIdColumn,
    ObjectID,
    Index
} from "typeorm";
import { toHexString } from "../../../src/lib/env";
import { Transform } from "class-transformer";
import { Wifi } from "./Wifi";
import { Message } from "./Message";
import { TimeOnApp } from "./TimeOnApp";

@Entity()
export class User {
    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    public static comparePassword(
        user: User,
        password: string
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                resolve(res === true);
            });
        });
    }

    @ObjectIdColumn()
    @Transform(toHexString, { toPlainOnly: true })
    public id: ObjectID;

    @IsEmail()
    @Column()
    @Index({ unique: true })
    public email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @Column()
    public password: string;

    @Column(type => Wifi)
    public wifiList: Wifi[];

    @Column(type => Message)
    public messageList: Message[];

    @Column(type => TimeOnApp)
    public timeOnAppList: TimeOnApp[];

    public toString(): string {
        return `${this.email}`;
    }

    @BeforeInsert()
    public async hashPassword(): Promise<void> {
        this.password = await User.hashPassword(this.password);
    }
}
