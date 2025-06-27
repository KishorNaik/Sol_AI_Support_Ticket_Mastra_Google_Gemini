import { Response } from 'express';
import {
	Body,
	HttpCode,
	JsonController,
	OnUndefined,
	Post,
	Put,
	Res,
	UseBefore,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { ValidationMiddleware } from '@/middlewares/security/validations';
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
import { mediator } from '@/shared/utils/helpers/medaitR';
import { getQueryRunner, UserEntity } from '@kishornaik/db';
import { logger } from '@/shared/utils/helpers/loggers';
import { UpdateUserRequestDto, UpdateUserResponseDto } from '../contracts';
import { UpdateUserMapEntityService } from './services/mapEntity';
import { UpdateUserDbService } from './services/db';
import { UpdateUserMapResponseService } from './services/mapResponse';

//#region Endpoint
@JsonController(`/api/v1/users`)
@OpenAPI({ tags: [`users`] })
export class UpdateUserEndpoint {
	@Put()
	@OpenAPI({
		summary: `update user`,
		tags: [`users`],
		description: `Update user`,
	})
	@HttpCode(StatusCodes.OK)
	@OnUndefined(StatusCodes.BAD_REQUEST)
	@UseBefore(ValidationMiddleware(UpdateUserRequestDto))
	public async postAsync(@Body() request: UpdateUserRequestDto, @Res() res: Response) {
		const response = await mediator.send(new UpdateUserCommand(request));
		return res.status(response.StatusCode).json(response);
	}
}
// #endregion

// #region Command
@sealed
class UpdateUserCommand extends RequestData<ApiDataResponse<UpdateUserResponseDto>> {
	private _request: UpdateUserRequestDto;
	public constructor(request: UpdateUserRequestDto) {
		super();
		this._request = request;
	}

	public get request(): UpdateUserRequestDto {
		return this._request;
	}
}
// #endregion

// Steps
enum UpdateUserSteps {
	MapEntityService = `UpdateUserCommandHandler:Map Entity Service`,
	DbService = `UpdateUserCommandHandler:Db Service`,
	MapResponseService = `UpdateUserCommandHandler:Map Response Service`,
}

// #region Command Handler
@sealed
@requestHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
	implements RequestHandler<UpdateUserCommand, ApiDataResponse<UpdateUserResponseDto>>
{
	private pipeline = new PipelineWorkflow(logger);
	private readonly _updateUserMapEntityService: UpdateUserMapEntityService;
	private readonly _updateUserDbService: UpdateUserDbService;
	private readonly _updateUserMapResponseService: UpdateUserMapResponseService;

	public constructor() {
		this._updateUserMapEntityService = Container.get(UpdateUserMapEntityService);
		this._updateUserDbService = Container.get(UpdateUserDbService);
		this._updateUserMapResponseService = Container.get(UpdateUserMapResponseService);
	}

	public async handle(value: UpdateUserCommand): Promise<ApiDataResponse<UpdateUserResponseDto>> {
		const queryRunner = getQueryRunner();
		await queryRunner.connect();
		try {
			// Guard
			if (!value)
				return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `value is required`);

			if (!value.request)
				return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `request is required`);

			const { request } = value;

			await queryRunner.startTransaction();

			// Map Entity Service
			await this.pipeline.step(UpdateUserSteps.MapEntityService, async () => {
				const result = await this._updateUserMapEntityService.handleAsync(request);
				return result;
			});

			// Db Service
			await this.pipeline.step(UpdateUserSteps.DbService, async () => {
				const mapEntityUserResult = this.pipeline.getResult<UserEntity>(
					UpdateUserSteps.MapEntityService
				);

				const result = await this._updateUserDbService.handleAsync({
					queryRunner: queryRunner,
					user: mapEntityUserResult,
				});

				return result;
			});

			// Map Response Service
			const response = await this.pipeline.step(
				UpdateUserSteps.MapResponseService,
				async () => {
					const userEntityResult = this.pipeline.getResult<UserEntity>(
						UpdateUserSteps.DbService
					);

					const result =
						await this._updateUserMapResponseService.handleAsync(userEntityResult);
					return result;
				}
			);

			await queryRunner.commitTransaction();

			// return
			return DataResponseFactory.success(
				StatusCodes.OK,
				response,
				`user updated successfully`
			);
		} catch (ex) {
			return await DataResponseFactory.pipelineError(
				ex as Error | PipelineWorkflowException,
				queryRunner
			);
		} finally {
			await queryRunner.release();
		}
	}
}
// #endregion
