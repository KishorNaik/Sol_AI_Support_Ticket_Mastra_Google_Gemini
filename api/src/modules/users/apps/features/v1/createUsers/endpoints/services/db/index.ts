import { AddUserDbService, QueryRunner, UserEntity } from '@kishornaik/db';
import {
	Container,
	err,
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

Container.set<AddUserDbService>(AddUserDbService, new AddUserDbService());

export interface ICreateUserDbServiceParameters {
	user: UserEntity;
	queryRunner: QueryRunner;
}

export interface ICreateUserDbService
	extends IServiceHandlerAsync<ICreateUserDbServiceParameters, UserEntity> {}

@sealed
@Service()
export class CreateUserDbService implements ICreateUserDbService {
	private readonly _addUserDbService: AddUserDbService;

	public constructor() {
		this._addUserDbService = Container.get<AddUserDbService>(AddUserDbService);
	}
	public handleAsync(
		params: ICreateUserDbServiceParameters
	): Promise<Result<UserEntity, ResultError>> {
		return tryCatchResultAsync(async () => {
			// Guard
			if (!params)
				return ResultFactory.error(StatusCodes.BAD_REQUEST, `Parameters are required`);

			if (!params.user)
				return ResultFactory.error(StatusCodes.BAD_REQUEST, `User entity is required`);

			if (!params.queryRunner)
				return ResultFactory.error(StatusCodes.BAD_REQUEST, `QueryRunner is required`);

			const user = await this._addUserDbService.handleAsync(params.user, params.queryRunner);
			if (user.isErr()) {
				const error = user.error;
				if (error.message.includes(`duplicate key value violates unique constraint`)) {
					return ResultFactory.error(
						StatusCodes.CONFLICT,
						`User with this email already exists`
					);
				}
				return ResultFactory.error(error.statusCode, error.message);
			}

			return ResultFactory.success(user.value);
		});
	}
}
