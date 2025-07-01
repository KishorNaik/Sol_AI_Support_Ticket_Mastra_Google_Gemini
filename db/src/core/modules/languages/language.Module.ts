import { ProgrammingLanguageEntity } from "./infrastructure/entity/programmingLanguage";

// Entity Db Datasource Register
export const languageModuleDbDataSourceRegisterEntity: Function[] = [ProgrammingLanguageEntity];

// Export Programming Language Module
export * from "./infrastructure/entity/programmingLanguage/index";
export * from "./apps/features/v1/addLanguage/index";
