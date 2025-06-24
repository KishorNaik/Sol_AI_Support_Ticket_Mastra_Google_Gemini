import { IsSafeString } from '@kishornaik/utils';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

// #region Request Dto
export class GetUserByEmailIdRequestDto {

  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsSafeString({ message: 'Name must not contain HTML or JavaScript code' })
  @Type(() => String)
  public emailId: string;
}
// #endregion

// #region Response Dto
export class GetUserByEmailIdResponseDto {
  public identifier?: string;
  public email?: string;
  public fullName?: string;
}
// #endregion
