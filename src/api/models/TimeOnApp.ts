import { IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class TimeOnApp {
    @IsNotEmpty()
    @IsString()
    @Column()
    public appName: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    public datetime: string;
}
