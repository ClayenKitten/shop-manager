import {
	Kysely,
	SqliteAdapter,
	SqliteIntrospector,
	SqliteQueryCompiler,
	type Dialect
} from "kysely";
import type { DB } from "kysely-codegen";
import { TauriSqlDriver } from "./driver";
import Database from "@tauri-apps/plugin-sql";

const dialect = {
	createAdapter: () => new SqliteAdapter(),
	createDriver: () =>
		new TauriSqlDriver({ database: Database.load("sqlite:data.db") }),
	createIntrospector: db => new SqliteIntrospector(db),
	createQueryCompiler: () => new SqliteQueryCompiler()
} satisfies Dialect;

let dbCache: Kysely<DB> | null = null;
export function db(): Kysely<DB> {
	if (dbCache === null) {
		dbCache = new Kysely<DB>({
			dialect
		});
	}
	return dbCache;
}
