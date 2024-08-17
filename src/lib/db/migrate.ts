import { Kysely, Migrator } from "kysely";
import MyMigrationProvider from "./migration-provider";

export default async function migrateToLatest(db: Kysely<any>) {
	const migrator = new Migrator({
		db,
		provider: new MyMigrationProvider(["00001_init"])
	});

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach(it => {
		if (it.status === "Success") {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === "Error") {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("failed to migrate");
		console.error(error);
		process.exit(1);
	}
}
