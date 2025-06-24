import { IServiceHandlerAsync, Ok, Result, ResultError, ResultExceptionFactory, sealed, Service, StatusCodes } from "@kishornaik/utils";
import {GetUserByEmailIdDbDto} from "@kishornaik/db"
import { GetUserByEmailIdRequestDto } from "../../../contracts";

export interface IGetUserByEmailMapEntityService extends IServiceHandlerAsync<GetUserByEmailIdRequestDto,GetUserByEmailIdDbDto>{

}

@sealed
@Service()
export class GetUserByEmailMapEntityService implements IGetUserByEmailMapEntityService{
  public async handleAsync(params: GetUserByEmailIdRequestDto): Promise<Result<GetUserByEmailIdDbDto, ResultError>> {
    try
    {
      // Guard
      if(!params)
        return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST,'Request parameters are required');

      // Map
      const map:GetUserByEmailIdDbDto=new GetUserByEmailIdDbDto();
      map.email=params.emailId;

      return new Ok(map);
    }
    catch(ex){
      const error=ex as Error;
      return ResultExceptionFactory.error(StatusCodes.INTERNAL_SERVER_ERROR,error.message);
    }
  }

}
