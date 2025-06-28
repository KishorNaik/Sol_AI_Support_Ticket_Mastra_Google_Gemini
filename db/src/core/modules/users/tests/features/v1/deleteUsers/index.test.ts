import test, { afterEach, beforeEach, describe } from 'node:test';
import { Guid, QueryRunner, StatusEnum } from '@kishornaik/utils';
import expect from 'expect';
import {
	destroyDatabase,
	getQueryRunner,
	initializeDatabase,
} from '../../../../../../config/dbSource';
import { randomUUID } from 'crypto';
import { UserEntity } from '../../../../users.Module';
import { DeleteUserDbService } from '../../../../apps/features/v1/deleteUsers';

// Debug Mode:All Test Case Run
//node --trace-deprecation --test --require ts-node/register -r tsconfig-paths/register ./src/core/modules/users/tests/features/v1/deleteUsers/index.test.ts

// Debug Mode:Specific Test Case Run
//node --trace-deprecation --test --test-name-pattern='test_name' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/users/tests/features/v1/deleteUsers/index.test.ts

// If Debug not Worked then use
//node --trace-deprecation --test --test-name-pattern='test_name' --require ts-node/register --inspect=4321 -r tsconfig-paths/register ./src/core/modules/users/tests/features/v1/deleteUsers/index.test.ts

describe(`Delete-Users-Unit-Tests`, () => {
	let queryRunner: QueryRunner;

	beforeEach(async () => {
		await initializeDatabase();
		queryRunner = getQueryRunner();
	});

	afterEach(async () => {
		await queryRunner.release();
		await destroyDatabase();
	});

	// node --trace-deprecation --test --test-name-pattern='should_return_false_when_user_entity_identifier_is_not_provided' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/users/tests/features/v1/deleteUsers/index.test.ts
	test(`should_return_false_when_user_entity_identifier_is_not_provided`, async () => {
		const user: UserEntity = new UserEntity();

		await queryRunner.startTransaction();

		const result = await new DeleteUserDbService().handleAsync(user, queryRunner);
		const isError = result.isErr();
		if (isError) {
			await queryRunner.rollbackTransaction();
			console.log(`Error: ${result.error.message}`);
			expect(isError).toBe(true);
			return;
		}

		await queryRunner.commitTransaction();
		expect(result.isOk()).toBe(false);
	});

	// node --trace-deprecation --test --test-name-pattern='should_return_false_when_user_entity_status_is_not_provided' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/users/tests/features/v1/deleteUsers/index.test.ts
	test(`should_return_false_when_user_entity_status_is_not_provided`, async () => {
		const user: UserEntity = new UserEntity();
		user.identifier = `230849ec-2565-4016-b21d-e21243affc4c`;

		await queryRunner.startTransaction();

		const result = await new DeleteUserDbService().handleAsync(user, queryRunner);
		const isError = result.isErr();
		if (isError) {
			await queryRunner.rollbackTransaction();
			console.log(`Error: ${result.error.message}`);
			expect(isError).toBe(true);
			return;
		}

		await queryRunner.commitTransaction();
		expect(result.isOk()).toBe(false);
	});

	// node --trace-deprecation --test --test-name-pattern='should_return_false_when_user_identifier_is_provide_wrong' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/users/tests/features/v1/deleteUsers/index.test.ts
	test(`should_return_false_when_user_identifier_is_provide_wrong`, async () => {
		const user: UserEntity = new UserEntity();
		user.identifier = '230849ec-2565-4016-b21d-e21243affc4d';
		user.status = StatusEnum.INACTIVE;

		await queryRunner.startTransaction();

		const result = await new DeleteUserDbService().handleAsync(user, queryRunner);
		const isError = result.isErr();
		if (isError) {
			await queryRunner.rollbackTransaction();
			console.log(`Error: ${result.error.message}`);
			expect(isError).toBe(true);
			return;
		}

		await queryRunner.commitTransaction();
		expect(result.isOk()).toBe(false);
	});

	// node --trace-deprecation --test --test-name-pattern='should_return_true_when_all_services_pass' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/users/tests/features/v1/deleteUsers/index.test.ts
	test(`should_return_true_when_all_services_pass`, async () => {
		const user: UserEntity = new UserEntity();
		user.identifier = `230849ec-2565-4016-b21d-e21243affc4c`;
		user.status = StatusEnum.INACTIVE;

		await queryRunner.startTransaction();

		const result = await new DeleteUserDbService().handleAsync(user, queryRunner);
		const isError = result.isErr();
		if (isError) {
			await queryRunner.rollbackTransaction();
			console.log(`Error: ${result.error.message}`);
			expect(isError).toBe(false);
			return;
		}

		await queryRunner.commitTransaction();
		expect(result.isOk()).toBe(true);
	});
});
