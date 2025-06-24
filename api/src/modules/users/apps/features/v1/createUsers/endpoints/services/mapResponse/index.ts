import { UserEntity } from '@kishornaik/db';
import {
	IServiceHandlerAsync,
	Ok,
	Result,
	ResultError,
	ResultExceptionFactory,
	sealed,
	Service,
	StatusCodes,
	tryCatchResultAsync,
} from '@kishornaik/utils';
import { CreateUsersResponseDto } from '../../../contracts';

export interface ICreateMapResponseService
	extends IServiceHandlerAsync<UserEntity, CreateUsersResponseDto> {}

@sealed
@Service()
export class CreateMapResponseService implements ICreateMapResponseService {
	public handleAsync(params: UserEntity): Promise<Result<CreateUsersResponseDto, ResultError>> {
		return tryCatchResultAsync(async () => {
			// Guard
			if (!params)
				return ResultExceptionFactory.error(
					StatusCodes.BAD_REQUEST,
					'User entity is required.'
				);

			// Map Response
			const response = new CreateUsersResponseDto();
			response.identifier = params.identifier;
			return new Ok(response);
		});
	}
}
