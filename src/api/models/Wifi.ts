import { Column } from "typeorm";
import { IsNotEmpty, IsString } from "class-validator";

export class Wifi {
    @IsNotEmpty()
    @IsString()
    @Column()
    public ssid: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    public name: string;
}
