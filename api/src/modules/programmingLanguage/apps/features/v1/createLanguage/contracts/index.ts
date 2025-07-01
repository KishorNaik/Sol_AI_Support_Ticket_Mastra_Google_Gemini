import { IsSafeString } from "@kishornaik/utils";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

// #region Request Dto
export class LanguageRequestDto{

  @IsString()
  @IsNotEmpty()
  @IsSafeString({ message: 'Name must not contain HTML or JavaScript code' })
  @Type(() => String)
  public name?:string;
}
// #endregion Request Dto

// #region Response Dto
export class LanguageResponseDto{
  public name?:string;
}
// #endregion
