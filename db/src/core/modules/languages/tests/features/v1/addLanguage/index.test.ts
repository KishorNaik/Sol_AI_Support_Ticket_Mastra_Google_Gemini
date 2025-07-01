import test, { afterEach, beforeEach, describe } from 'node:test';
import { Guid, QueryRunner, StatusEnum } from '@kishornaik/utils';
import expect from 'expect';
import {
	destroyDatabase,
	getQueryRunner,
	initializeDatabase,
} from '../../../../../../config/dbSource';
import { randomUUID } from 'crypto';
import {
	AddProgrammingLanguageDbService,
	ProgrammingLanguageEntity,
} from '../../../../language.Module';

// Debug Mode:All Test Case Run
//node --trace-deprecation --test --require ts-node/register -r tsconfig-paths/register ./src/core/modules/languages/tests/features/v1/addLanguage/index.test.ts

// Debug Mode:Specific Test Case Run
//node --trace-deprecation --test --test-name-pattern='test_name' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/languages/tests/features/v1/addLanguage/index.test.ts

// If Debug not Worked then use
//node --trace-deprecation --test --test-name-pattern='test_name' --require ts-node/register --inspect=4321 -r tsconfig-paths/register ./src/core/modules/languages/tests/features/v1/addLanguage/index.test.ts

describe(`Add-Language-Unit-Test`, () => {
	let queryRunner: QueryRunner;

	beforeEach(async () => {
		await initializeDatabase();
		queryRunner = getQueryRunner();
	});

	afterEach(async () => {
		await queryRunner.release();
		await destroyDatabase();
	});

	// node --trace-deprecation --test --test-name-pattern='should_return_false_when_language_entity_identifier_is_not_provided' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/languages/tests/features/v1/addLanguage/index.test.ts
	test(`should_return_false_when_language_entity_identifier_is_not_provided`, async () => {
		const entity: ProgrammingLanguageEntity = new ProgrammingLanguageEntity();
		entity.name = 'c';

		await queryRunner.startTransaction();

		const result = await new AddProgrammingLanguageDbService().handleAsync(entity, queryRunner);
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

	// node --trace-deprecation --test --test-name-pattern='should_return_false_when_language_entity_status_is_not_provided' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/languages/tests/features/v1/addLanguage/index.test.ts
	test(`should_return_false_when_language_entity_status_is_not_provided`, async () => {
		const entity: ProgrammingLanguageEntity = new ProgrammingLanguageEntity();
		entity.identifier = randomUUID().toString();
		entity.name = 'c';

		await queryRunner.startTransaction();

		const result = await new AddProgrammingLanguageDbService().handleAsync(entity, queryRunner);
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

	// node --trace-deprecation --test --test-name-pattern='should_return_false_when_validation_service_failed' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/languages/tests/features/v1/addLanguage/index.test.ts
	test(`should_return_false_when_validation_service_failed`, async () => {
		const entity: ProgrammingLanguageEntity = new ProgrammingLanguageEntity();
		entity.identifier = randomUUID().toString();
		entity.status = StatusEnum.ACTIVE;
		entity.name = '';

		await queryRunner.startTransaction();

		const result = await new AddProgrammingLanguageDbService().handleAsync(entity, queryRunner);
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

	// node --trace-deprecation --test --test-name-pattern='should_return_true_when_all_services_pass' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/languages/tests/features/v1/addLanguage/index.test.ts
	test(`should_return_true_when_all_services_pass`, async () => {
		const entity: ProgrammingLanguageEntity = new ProgrammingLanguageEntity();
		entity.identifier = randomUUID().toString();
		entity.status = StatusEnum.ACTIVE;
		entity.name = 'c';

		await queryRunner.startTransaction();

		const result = await new AddProgrammingLanguageDbService().handleAsync(entity, queryRunner);
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

	// node --trace-deprecation --test --test-name-pattern='should_return_false_when_language_already_exist' --require ts-node/register -r tsconfig-paths/register ./src/core/modules/languages/tests/features/v1/addLanguage/index.test.ts
	test(`should_return_false_when_language_already_exist`, async () => {
		const entity: ProgrammingLanguageEntity = new ProgrammingLanguageEntity();
		entity.identifier = randomUUID().toString();
		entity.status = StatusEnum.ACTIVE;
		entity.name = 'c';

		await queryRunner.startTransaction();

		const result = await new AddProgrammingLanguageDbService().handleAsync(entity, queryRunner);
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
});
