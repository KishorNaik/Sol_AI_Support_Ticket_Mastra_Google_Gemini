import { ProgrammingLanguageEntity } from "@kishornaik/db";
import { IServiceHandlerAsync, Result, ResultError, ResultFactory, sealed, Service, StatusCodes, StatusEnum, tryCatchResultAsync } from "@kishornaik/utils";
import { CreateProgrammingLanguageRequestDto } from "../../../contracts";
import { randomUUID } from "crypto";

export interface ICreateProgrammingLanguageMapEntityService extends IServiceHandlerAsync<CreateProgrammingLanguageRequestDto,ProgrammingLanguageEntity>{}

@sealed
@Service()
export class CreateProgrammingLanguageMapEntityService implements ICreateProgrammingLanguageMapEntityService {
  public handleAsync(params: CreateProgrammingLanguageRequestDto): Promise<Result<ProgrammingLanguageEntity, ResultError>> {
    return tryCatchResultAsync(async ()=>{
      // Guard
      if(!params)
        return ResultFactory.error(StatusCodes.BAD_REQUEST,'Request parameters are required.');

      // Destructuring
      const {name}=params;

      // Map Entity
      const entity = new ProgrammingLanguageEntity();
      entity.identifier=randomUUID().toString();
      entity.status=StatusEnum.ACTIVE;
      entity.name=name;
      entity.created_date=new Date();
      entity.modified_date=new Date();

      return ResultFactory.success(entity);
    });
  }

}
