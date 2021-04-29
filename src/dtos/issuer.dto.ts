import { IsString, IsEmail } from 'class-validator';

export class SendVerificationMailDto {
  @IsEmail()
  public email: string;

  @IsString()
  public did: string;
}
