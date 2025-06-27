import { sealed, Service } from "@kishornaik/utils";
import { UpdateService } from "../../../../../../shared/services/db/update";
import { UserEntity } from "../../../../users.Module";

@sealed
@Service()
export class EditUserDbService extends UpdateService<UserEntity>{
 public constructor() {
    super(UserEntity);
  }
}
