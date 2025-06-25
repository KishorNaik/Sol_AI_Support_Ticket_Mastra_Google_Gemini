import { UserEntity } from '@kishornaik/db';
import {
	IServiceHandlerAsync,
	Ok,
	Result,
	ResultError,
	ResultFactory,
	sealed,
	Service,
	StatusCodes,
	tryCatchResultAsync,
} from '@kishornaik/utils';
import { GetUserByEmailIdResponseDto } from '../../../contracts';

export interface IGetUserByEmailIdMapResponseService
	extends IServiceHandlerAsync<UserEntity, GetUserByEmailIdResponseDto> {}

@sealed
@Service()
export class GetUserByEmailIdMapResponseService implements IGetUserByEmailIdMapResponseService {
	public handleAsync(
		params: UserEntity
	): Promise<Result<GetUserByEmailIdResponseDto, ResultError>> {
		return tryCatchResultAsync(async () => {
			// Guard
			if (!params)
				return ResultFactory.error(StatusCodes.BAD_REQUEST, 'User entity is required.');

			// Map
			const response = new GetUserByEmailIdResponseDto();
			response.identifier = params.identifier;
			response.email = params.email;
			response.fullName = params.fullName;

			return ResultFactory.success(response);
		});
	}
}
