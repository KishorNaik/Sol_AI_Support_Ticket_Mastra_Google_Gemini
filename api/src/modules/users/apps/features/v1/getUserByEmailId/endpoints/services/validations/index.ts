import { DtoValidation, sealed, Service } from "@kishornaik/utils";
import { GetUserByEmailIdRequestDto } from "../../../contracts";

@sealed
@Service()
export class GetUserByEmailIdValidationService extends DtoValidation<GetUserByEmailIdRequestDto>{
  public constructor() {
    super();
  }
}
