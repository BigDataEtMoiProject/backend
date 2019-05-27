import { IsNotEmpty, IsString } from "class-validator";
import { Column } from "typeorm";

export class Coordinates {
    @IsNotEmpty()
    @IsString()
    @Column()
    public longitude: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    public latitude: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    public date: string;

    public city: string;
}
