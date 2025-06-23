import { QueryRunner, UserEntity } from "@kishornaik/db";

export interface ICreateUserDbServiceParameters{
  user:UserEntity
  queryRunner:QueryRunner;
}

