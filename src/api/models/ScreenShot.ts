import { Column } from "typeorm";
import { IsNotEmpty, IsString } from "class-validator";

export class ScreenShot {
    @IsNotEmpty()
    @IsString()
    @Column()
    public screenShot: string;

    @IsNotEmpty()
    @IsString()
    @Column()
    public datetime: string;

    @Column()
    public path: string;
}
