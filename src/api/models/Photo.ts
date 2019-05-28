import { Column } from "typeorm";
import { IsNotEmpty, IsString } from "class-validator";

export class Photo {
    @IsNotEmpty()
    @IsString()
    @Column()
    public img: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    public datetime: string;

    @Column()
    public path: string;
}
