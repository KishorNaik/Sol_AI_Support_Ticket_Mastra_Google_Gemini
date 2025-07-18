import {
	Container,
	DtoValidation,
	Err,
	IDtoValidation,
	Ok,
	Result,
	ResultError,
	Service,
	StatusCodes,
} from '@kishornaik/utils';
import { dbDataSource, QueryRunner } from '../../../../config/dbSource';

export interface IGetVersionByIdentifierServiceResult {
	identifier: string;
	version: number;
}

export interface IGetVersionByIdentifierService<TInput> {
	handleAsync(
		params: TInput,
		queryRunner?: QueryRunner
	): Promise<Result<IGetVersionByIdentifierServiceResult | null, ResultError>>;
}

@Service()
export class GetByVersionIdentifierService<T extends object>
	implements IGetVersionByIdentifierService<T>
{
	private readonly dtoValidation: IDtoValidation<T>;

	public constructor(entity: new () => T) {
		this.entity = entity;
		this.dtoValidation = Container.get(DtoValidation<T>);
	}

	private entity: new () => T;

	public async handleAsync(
		params: T,
		queryRunner?: QueryRunner
	): Promise<Result<IGetVersionByIdentifierServiceResult | null, ResultError>> {
		let response: IGetVersionByIdentifierServiceResult | null = null;
		try {
			if ('identifier' in (params as any) === false)
				return new Err(new ResultError(StatusCodes.BAD_REQUEST, 'Identifier is required'));

			if ('status' in (params as any) === false)
				return new Err(new ResultError(StatusCodes.BAD_REQUEST, 'Status is required'));

			// Validate Entity
			const validationResult = await this.dtoValidation.handleAsync({
				dto: params,
				dtoClass: (params as any).constructor,
			});
			if (validationResult.isErr()) return new Err(validationResult.error);

			// Run Query Runner
			const entityManager = queryRunner ? queryRunner.manager : dbDataSource.manager;

			// Get Entity
			const result = await entityManager
				.createQueryBuilder(this.entity, 'entity')
				.select(['entity.identifier', 'entity.version'])
				.where('entity.identifier = :identifier', {
					identifier: (params as any).identifier,
				})
				.andWhere('entity.status = :status', {
					status: (params as any).status,
				})
				.getOne();

			// Check if get is successfully
			if (!result) return new Err(new ResultError(StatusCodes.NOT_FOUND, 'entity not found'));

			const entity = result as any;

			if ('identifier' in entity && 'version' in entity) {
				response = {
					identifier: entity.identifier,
					version: entity.version,
				};
			}

			if (!response)
				return new Err(new ResultError(StatusCodes.NOT_FOUND, 'Version row not found'));

			// Return response
			return new Ok(response);
		} catch (ex) {
			const error = ex as Error;
			return new Err(new ResultError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
		}
	}
}
