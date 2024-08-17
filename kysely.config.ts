import { defineConfig } from "kysely-ctl";
import { SqliteDialect } from "kysely";
import Sqlite from "better-sqlite3";
import { join } from "path";

export default defineConfig({
	dialect: new SqliteDialect({
		database: new Sqlite(
			join(process.env.HOME!, "/.config/ru.clayenkitten.shop-manager/data.db")
		)
	}),
	migrations: {
		migrationFolder: "./src/lib/db/migrations"
	}
	//   plugins: [],
	//   seeds: {
	//     seedFolder: "seeds",
	//   }
});
