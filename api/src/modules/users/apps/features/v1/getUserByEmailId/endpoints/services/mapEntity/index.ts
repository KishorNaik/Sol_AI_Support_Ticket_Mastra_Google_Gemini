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
import { GetUserByEmailIdDbDto } from '@kishornaik/db';
import { GetUserByEmailIdRequestDto } from '../../../contracts';

export interface IGetUserByEmailMapEntityService
	extends IServiceHandlerAsync<GetUserByEmailIdRequestDto, GetUserByEmailIdDbDto> {}

@sealed
@Service()
export class GetUserByEmailMapEntityService implements IGetUserByEmailMapEntityService {
	public handleAsync(
		params: GetUserByEmailIdRequestDto
	): Promise<Result<GetUserByEmailIdDbDto, ResultError>> {
		return tryCatchResultAsync(async () => {
			// Guard
			if (!params)
				return ResultExceptionFactory.error(
					StatusCodes.BAD_REQUEST,
					'Request parameters are required'
				);

			// Map
			const map: GetUserByEmailIdDbDto = new GetUserByEmailIdDbDto();
			map.email = params.emailId;

			return new Ok(map);
		});
	}
}
