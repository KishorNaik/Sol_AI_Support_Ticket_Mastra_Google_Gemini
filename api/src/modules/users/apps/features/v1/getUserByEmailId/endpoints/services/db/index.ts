import { GetUserByEmailDbService, GetUserByEmailIdDbDto, UserEntity } from '@kishornaik/db';
import {
	Container,
	IServiceHandlerAsync,
	QueryRunner,
	Result,
	ResultError,
	ResultFactory,
	sealed,
	Service,
	StatusCodes,
	tryCatchResultAsync,
} from '@kishornaik/utils';

Container.set<GetUserByEmailDbService>(GetUserByEmailDbService, new GetUserByEmailDbService());

export interface GetUserByEmailIdDbQueryServiceParameters {
	user: GetUserByEmailIdDbDto;
	queryRunner?: QueryRunner;
}

export interface IGetUserByEmailIdDbQueryService
	extends IServiceHandlerAsync<GetUserByEmailIdDbQueryServiceParameters, UserEntity> {}

@sealed
@Service()
export class GetUserByEmailIdDbQueryService implements IGetUserByEmailIdDbQueryService {
	private readonly _getUserByEmailDbService: GetUserByEmailDbService;

	public constructor() {
		this._getUserByEmailDbService = Container.get(GetUserByEmailDbService);
	}

	public handleAsync(
		params: GetUserByEmailIdDbQueryServiceParameters
	): Promise<Result<UserEntity, ResultError>> {
		return tryCatchResultAsync(async () => {
			// Guard
			if (!params)
				return ResultFactory.error(
					StatusCodes.BAD_REQUEST,
					'Request parameters are required'
				);

			if (!params.user)
				return ResultFactory.error(StatusCodes.BAD_REQUEST, 'User is required');

			if (!params.queryRunner)
				return ResultFactory.error(StatusCodes.BAD_REQUEST, 'QueryRunner is required');

			const { user, queryRunner } = params;

			const result = await this._getUserByEmailDbService.handleAsync({
				user: user,
				queryRunner: queryRunner,
			});

			return result;
		});
	}
}
