import {
	IServiceHandlerAsync,
	Ok,
	Result,
	ResultError,
	ResultExceptionFactory,
	sealed,
	Service,
	StatusCodes,
	StatusEnum,
	tryCatchResultAsync,
} from '@kishornaik/utils';
import { CreateUsersRequestDto } from '../../../contracts';
import { UserEntity } from '@kishornaik/db';
import { randomUUID } from 'crypto';

export interface ICreateUserMapEntityService
	extends IServiceHandlerAsync<CreateUsersRequestDto, UserEntity> {}

@sealed
@Service()
export class CreateUserMapEntityService implements ICreateUserMapEntityService {
	public handleAsync(params: CreateUsersRequestDto): Promise<Result<UserEntity, ResultError>> {
		return tryCatchResultAsync(async () => {
			// Guard
			if (!params)
				return ResultExceptionFactory.error(
					StatusCodes.BAD_REQUEST,
					'Request parameters are required.'
				);

			// Map Entity
			const user = new UserEntity();
			user.identifier = randomUUID().toString();
			user.status = StatusEnum.ACTIVE;
			user.fullName = params.fullName;
			user.email = params.email;
			user.created_date = new Date();
			user.modified_date = new Date();

			return new Ok(user);
		});
	}
}
