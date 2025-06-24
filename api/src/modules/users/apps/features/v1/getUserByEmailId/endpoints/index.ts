import { Response, Request } from 'express';
import { Get, HttpCode, JsonController, OnUndefined, Param, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import {
	RequestData,
	sealed,
	StatusCodes,
	DataResponse as ApiDataResponse,
	requestHandler,
	RequestHandler,
	DataResponseFactory,
	PipelineWorkflowException,
	PipelineWorkflow,
	Container,
} from '@kishornaik/utils';
import { GetUserByEmailIdRequestDto, GetUserByEmailIdResponseDto } from '../contracts';
import { getQueryRunner, GetUserByEmailIdDbDto, UserEntity } from '@kishornaik/db';
import { logger } from '@/shared/utils/helpers/loggers';
import { GetUserByEmailIdValidationService } from './services/validations';
import { GetUserByEmailMapEntityService } from './services/mapEntity';
import { GetUserByEmailIdDbQueryService } from './services/db';
import { GetUserByEmailIdMapResponseService } from './services/mapResponse';
import { mediator } from '@/shared/utils/helpers/medaitR';

// #region Endpoint
@JsonController('/api/v1/users')
@OpenAPI({ tags: ['users'] })
export class GetUserByEmailIdEndpoint {
	@Get('/:email')
	@OpenAPI({ summary: `get user by identifier`, tags: ['users'] })
	@HttpCode(StatusCodes.OK)
	@OnUndefined(StatusCodes.NOT_FOUND)
	@OnUndefined(StatusCodes.BAD_REQUEST)
	async getUserByEmailId(@Param('email') email: string, @Res() res: Response) {
		const request = new GetUserByEmailIdRequestDto();
		request.emailId = email;

		const response = await mediator.send(new GetUserByEmailQuery(request));
		return res.status(response.StatusCode).json(response);
	}
}
// #endregion

// #region Query
@sealed
class GetUserByEmailQuery extends RequestData<ApiDataResponse<GetUserByEmailIdResponseDto>> {
	private readonly _request: GetUserByEmailIdRequestDto;

	public constructor(request: GetUserByEmailIdRequestDto) {
		super();
		this._request = request;
	}

	public get request(): GetUserByEmailIdRequestDto {
		return this._request;
	}
}
// #endregion

// #region Query Handler
@sealed
@requestHandler(GetUserByEmailQuery)
class GetUserByEmailQueryHandler
	implements RequestHandler<GetUserByEmailQuery, ApiDataResponse<GetUserByEmailIdResponseDto>>
{
	private pipeline = new PipelineWorkflow(logger);
	private readonly _getUserByEmailIdValidationService: GetUserByEmailIdValidationService;
	private readonly _getUserByEmailMapEntityService: GetUserByEmailMapEntityService;
	private readonly _getUserByEmailIdDbQueryService: GetUserByEmailIdDbQueryService;
	private readonly _getUserByEmailIdMapResponseService: GetUserByEmailIdMapResponseService;

	public constructor() {
		this._getUserByEmailIdValidationService = Container.get(GetUserByEmailIdValidationService);
		this._getUserByEmailMapEntityService = Container.get(GetUserByEmailMapEntityService);
		this._getUserByEmailIdDbQueryService = Container.get(GetUserByEmailIdDbQueryService);
		this._getUserByEmailIdMapResponseService = Container.get(
			GetUserByEmailIdMapResponseService
		);
	}

	public async handle(
		value: GetUserByEmailQuery
	): Promise<ApiDataResponse<GetUserByEmailIdResponseDto>> {
		const queryRunner = getQueryRunner();
		await queryRunner.connect();
		try {
			// Guard
			if (!value)
				return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `Value is required`);

			if (!value.request)
				return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `Request is required`);

			const { request } = value;

			await queryRunner.startTransaction();

			// Validation Service
			await this.pipeline.step(
				`GetUserByEmailIdEndpoint:Validation Service pipeline`,
				async () => {
					const result = await this._getUserByEmailIdValidationService.handleAsync({
						dto: request,
						dtoClass: GetUserByEmailIdRequestDto,
					});
					return result;
				}
			);

			// Map Service
			const mapResult: GetUserByEmailIdDbDto = await this.pipeline.step(
				`GetUserByEmailIdEndpoint:Map Service pipeline`,
				async () => {
					const result = await this._getUserByEmailMapEntityService.handleAsync(request);
					return result;
				}
			);

			// Db Query Service
			const userDbResult: UserEntity = await this.pipeline.step(
				`GetUserByEmailIdEndpoint:Db Query Service pipeline`,
				async () => {
					const result = await this._getUserByEmailIdDbQueryService.handleAsync({
						user: mapResult,
						queryRunner: queryRunner,
					});
					return result;
				}
			);

			// Response Service
			const response = await this.pipeline.step(
				`GetUserByEmailIdEndpoint:Response Service pipeline`,
				async () => {
					const result =
						await this._getUserByEmailIdMapResponseService.handleAsync(userDbResult);
					return result;
				}
			);

			await queryRunner.commitTransaction();

			return DataResponseFactory.success(
				StatusCodes.OK,
				response,
				`User retrieved successfully`
			);
		} catch (ex) {
			const error = ex as Error | PipelineWorkflowException;

			if (error instanceof PipelineWorkflowException) {
				if (queryRunner.isTransactionActive) {
					await queryRunner.rollbackTransaction();
				}
				return DataResponseFactory.error(error.statusCode, error.message);
			}

			return DataResponseFactory.error(StatusCodes.INTERNAL_SERVER_ERROR, error.message);
		} finally {
			await queryRunner.release();
		}
	}
}
// #endregion
