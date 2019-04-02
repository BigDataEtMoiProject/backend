import { IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class Message {
    @IsNotEmpty()
    @IsString()
    @Column()
    public message: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    public phone: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    public date: string;
}
