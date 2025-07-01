import { IsSafeString } from '@kishornaik/utils';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

// #region Request Dto
export class RemoveUserRequestDto {
	@IsNotEmpty()
	@IsUUID()
	@IsSafeString({ message: 'identifier must not contain HTML or JavaScript code' })
	public identifier?: string;
}
// #endregion

// #region Response Dto
export class RemoveUserResponseDto {
	public identifier?: string;
}
// #endregion
