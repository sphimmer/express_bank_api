import { IsAlpha, IsEmail, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { ICustomerWritable } from "../interfaces/ICustomer";

export class UpdateCustomer implements Partial<ICustomerWritable>{

    constructor(id: number, data: Partial<ICustomerWritable>){
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.email = data.email
        this.SSN = data.SSN
        this.id = id
    }

    @IsNumber()
    id: number

    @IsAlpha()
    @MinLength(1)
    @IsOptional()
    firstName?: string;

    @IsAlpha()
    @MinLength(1)
    @IsOptional()
    lastName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MaxLength(11)
    @IsOptional()
    SSN?: string;
}