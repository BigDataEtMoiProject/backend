import { IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class CallHistory {
    @IsNotEmpty()
    @IsString()
    @Column()
    public name: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    public phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    public date: string;
}
