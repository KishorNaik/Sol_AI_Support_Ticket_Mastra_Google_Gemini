import { programmingLanguageModule } from './programmingLanguage/language.Module';
import { userModules } from './users/user.Module';

export const modulesFederation: Function[] = [...userModules,...programmingLanguageModule];
