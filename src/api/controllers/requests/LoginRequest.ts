import { IsNotEmpty, IsString, MinLength, IsEmail } from "class-validator";

export class LoginRequest {
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    public password: string;
}
