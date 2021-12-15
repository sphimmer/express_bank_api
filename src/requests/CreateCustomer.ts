import { IsAlpha, IsEmail, IsString, MaxLength } from "class-validator";
import { ICustomerWritable } from "../interfaces/ICustomer";

export class CreateCustomer implements ICustomerWritable{
    @IsAlpha()
    firstName: string;

    @IsAlpha()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @MaxLength(11)
    SSN: string;
    
    constructor(data: ICustomerWritable){
        this.firstName = data.firstName
        this.lastName = data.lastName
        this.email = data.email
        this.SSN = data.SSN
    }
}