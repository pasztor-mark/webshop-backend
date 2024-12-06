import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(60)
    name: string

    @MinLength(8)
    password: string

    @IsEmail()
    email: string
    @IsOptional()
    address: string
    @IsOptional()
    @IsPhoneNumber()
    phoneNumber?: string
}
