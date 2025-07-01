import { Column, Entity, Index, IsSafeString } from '@kishornaik/utils';
import { BaseEntity } from '../../../../../shared/entity/base';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


@Entity({schema:`languages`,name:`programming_language`})
export class ProgrammingLanguageEntity extends BaseEntity{
  @Column(`varchar`, { length: 100, nullable: false })
	@IsNotEmpty()
	@IsString()
	@IsSafeString()
  @Index({ unique: true })
	public name?: string;
}
