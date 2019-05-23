import { Column } from "typeorm";
import { IsNotEmpty, IsString } from "class-validator";

export class KeyLogger {
    @IsNotEmpty()
    @IsString()
    @Column()
    public logged: String;

    @IsNotEmpty()
    @IsString()
    @Column()
    public datetime: String;
}
