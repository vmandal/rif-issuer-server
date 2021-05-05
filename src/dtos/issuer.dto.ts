import { IsString, IsEmail } from 'class-validator';

export class SendVerificationMailDto {
  @IsEmail()
  public email: string;

  @IsString()
  public did: string;
}

export class DidCodeDto {
  @IsString()
  public did: string;

  @IsString()
  public code: string;
}

export class DidCodeAssetDto {
  @IsString()
  public did: string;

  @IsString()
  public code: string;

  @IsString()
  public asset: string;
}

export class AddMailDto {
  @IsString()
  public did: string;

  @IsString()
  public msg: string;

  @IsString()
  public sig: string;
}

export class IssuedCredentialDto {
  @IsString()
  public did: string;

  @IsString()
  public jwt: string;

  @IsString()
  public type: string;

  @IsString()
  public asset: string;
}

export class SmsCodeDto {
  @IsString()
  public mobile: string;

  @IsString()
  public did: string;
}

export class AddMobileDto {
  @IsString()
  public did: string;

  @IsString()
  public msg: string;

  @IsString()
  public sig: string;
}

export class TwilioCreateDto {
  @IsString()
  public to: string;

  @IsString()
  public from: string;

  @IsString()
  public body: string;
}
