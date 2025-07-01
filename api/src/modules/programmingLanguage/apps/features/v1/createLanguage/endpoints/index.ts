import { Response } from 'express';
import {
	Body,
	HttpCode,
	JsonController,
	OnUndefined,
	Post,
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
import { getQueryRunner } from '@kishornaik/db';
import { logger } from '@/shared/utils/helpers/loggers';
import {
	CreateProgrammingLanguageRequestDto,
	CreateProgrammingLanguageResponseDto,
} from '../contracts';
import { CreateProgrammingLanguageMapEntityService } from './services/mapEntity';
import { CreateProgrammingLanguageDbService } from './services/dbService';
import { CreateProgrammingLanguageMapResponseService } from './services/mapResponse';

// #region Endpoint
@JsonController(`/api/v1/programming-language`)
@OpenAPI({ tags: [`programming-language`] })
export class CreateProgrammingLanguageEndpoint {
	@Post()
	@OpenAPI({
		summary: `Create programming language`,
		tags: [`programming-language`],
		description: `Create programming language in the system.`,
	})
	@HttpCode(StatusCodes.OK)
	@OnUndefined(StatusCodes.BAD_REQUEST)
	@UseBefore(ValidationMiddleware(CreateProgrammingLanguageRequestDto))
	public async postAsync(
		@Body() request: CreateProgrammingLanguageRequestDto,
		@Res() res: Response
	) {
		const response = await mediator.send(new CreateProgrammingLanguageCommand(request));
		return res.status(response.StatusCode).json(response);
	}
}
// #endregion

// #region Command
@sealed
export class CreateProgrammingLanguageCommand extends RequestData<
	ApiDataResponse<CreateProgrammingLanguageResponseDto>
> {
	private readonly _request: CreateProgrammingLanguageRequestDto;

	public constructor(request: CreateProgrammingLanguageRequestDto) {
		super();
		this._request = request;
	}

	public get request(): CreateProgrammingLanguageRequestDto {
		return this._request;
	}
}
// #endregion

// pipeline Steps
enum PipelineSteps {
	MAP_ENTITY_SERVICE = 'pipeline_map_entity_service',
	DB_SERVICE = 'pipeline_db_service',
	MAP_RESPONSE_SERVICE = 'pipeline_map_response_service',
}

// #region Command Handler
@sealed
@requestHandler(CreateProgrammingLanguageCommand)
export class CreateProgrammingLanguageCommandHandler
	implements
		RequestHandler<
			CreateProgrammingLanguageCommand,
			ApiDataResponse<CreateProgrammingLanguageResponseDto>
		>
{
	private pipeline = new PipelineWorkflow(logger);
	private readonly _createProgrammingLanguageMapEntityService: CreateProgrammingLanguageMapEntityService;
	private readonly _createProgrammingLanguageDbService: CreateProgrammingLanguageDbService;
	private readonly _createProgrammingLanguageMapResponseService: CreateProgrammingLanguageMapResponseService;

	public constructor() {
		this._createProgrammingLanguageMapEntityService = Container.get(
			CreateProgrammingLanguageMapEntityService
		);
		this._createProgrammingLanguageDbService = Container.get(
			CreateProgrammingLanguageDbService
		);
		this._createProgrammingLanguageMapResponseService = Container.get(
			CreateProgrammingLanguageMapResponseService
		);
	}

	public async handle(
		value: CreateProgrammingLanguageCommand
	): Promise<ApiDataResponse<CreateProgrammingLanguageResponseDto>> {
		const queryRunner = getQueryRunner();
		await queryRunner.connect();
		try {
			// Guard
			if (!value)
				return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `Value is required`);

			if (!value.request)
				return DataResponseFactory.error(StatusCodes.BAD_REQUEST, `Request is required`);

			// Destructure
			const { request } = value;

			await queryRunner.startTransaction();

			// Map Entity Service
			await this.pipeline.step(PipelineSteps.MAP_ENTITY_SERVICE, async () => {
				const result =
					await this._createProgrammingLanguageMapEntityService.handleAsync(request);
				return result;
			});

			// Db Service
			await this.pipeline.step(PipelineSteps.DB_SERVICE, async () => {
				// Get Result from `PipelineSteps.MAP_ENTITY_SERVICE`
				const mapEntityResult =
					this.pipeline.getResult<CreateProgrammingLanguageRequestDto>(
						PipelineSteps.MAP_ENTITY_SERVICE
					);

				// Insert Programming Language
				const result = await this._createProgrammingLanguageDbService.handleAsync({
					queryRunner: queryRunner,
					entity: mapEntityResult,
				});
				return result;
			});

			// Map Response Service
			await this.pipeline.step(PipelineSteps.MAP_RESPONSE_SERVICE, async () => {
				// Get Result from `PipelineSteps.DB_SERVICE`
				const dbServiceResult =
					this.pipeline.getResult<CreateProgrammingLanguageRequestDto>(
						PipelineSteps.DB_SERVICE
					);

				// Map Response
				const result =
					await this._createProgrammingLanguageMapResponseService.handleAsync(
						dbServiceResult
					);
				return result;
			});

			await queryRunner.commitTransaction();

			// Return
			const response = this.pipeline.getResult<CreateProgrammingLanguageResponseDto>(
				PipelineSteps.MAP_RESPONSE_SERVICE
			);
			return DataResponseFactory.success(
				StatusCodes.CREATED,
				response,
				`Programming Language created successfully`
			);
		} catch (ex) {
			return await DataResponseFactory.pipelineError(ex, queryRunner);
		} finally {
			await queryRunner.release();
		}
	}
}
