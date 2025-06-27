import { IsSafeString } from '@kishornaik/utils';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

// #region Request Dto
export class UpdateUserRequestDto {
	@IsNotEmpty()
	@IsUUID()
	@IsSafeString({ message: 'identifier must not contain HTML or JavaScript code' })
	public identifier?: string;

	@IsString()
	@IsNotEmpty()
	@IsSafeString({ message: 'FullName must not contain HTML or JavaScript code' })
	@Length(2, 50, { message: 'Full name must be between 2 and 50 characters' })
	@Type(() => String)
	public fullName?: string;

	@IsString()
	@IsNotEmpty()
	@IsEmail({}, { message: 'Email must be a valid email address' })
	@IsSafeString({ message: 'Name must not contain HTML or JavaScript code' })
	@Type(() => String)
	public email?: string;
}
// #endregion

// #region Response Dto
export class UpdateUserResponseDto {
	public identifier?: string;
}
// #endregion
