import {
	IServiceHandlerAsync,
	Result,
	ResultError,
	ResultFactory,
	sealed,
	Service,
	StatusCodes,
	StatusEnum,
	tryCatchResultAsync,
} from '@kishornaik/utils';
import { UpdateUserRequestDto } from '../../../contracts';
import { UserEntity } from '@kishornaik/db';
import { randomUUID } from 'crypto';

export interface IUpdateUserMapEntityService
	extends IServiceHandlerAsync<UpdateUserRequestDto, UserEntity> {}

@sealed
@Service()
export class UpdateUserMapEntityService implements IUpdateUserMapEntityService {
	public handleAsync(params: UpdateUserRequestDto): Promise<Result<UserEntity, ResultError>> {
		return tryCatchResultAsync(async () => {
			// Guard
			if (!params)
				return ResultFactory.error(
					StatusCodes.BAD_REQUEST,
					`Request parameters are required`
				);

			// Map
			const userEntity: UserEntity = new UserEntity();
			userEntity.identifier = params.identifier;
			userEntity.status = StatusEnum.ACTIVE;
			userEntity.fullName = params.fullName;
			userEntity.email = params.email;
			userEntity.created_date = new Date();
			userEntity.modified_date = new Date();

      //throw new Error('Not implemented');
      //return ResultFactory.success(undefined);

			return ResultFactory.success(userEntity);
		});
	}
}
