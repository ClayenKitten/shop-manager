import type {
	DatabaseConnection,
	QueryResult as KyselyQueryResult
} from "kysely";
import { CompiledQuery, SelectQueryNode } from "kysely";

export class TauriSqlDriver {
	private config: TauriSqliteDialectConfig;
	private db?: TauriSqlDB;
	private connectionMutex = new ConnectionMutex();
	private connection?: DatabaseConnection;

	constructor(config: TauriSqliteDialectConfig) {
		this.config = config;
	}

	async init(): Promise<void> {
		this.db = await this.config.database;
		this.connection = new TauriSqlConnection(this.db);

		await this.config.onCreateConnection?.(this.connection);
	}

	async acquireConnection(): Promise<DatabaseConnection> {
		// plugin only has one single connection. We use a mutex here to wait
		// until the single connection has been released.
		await this.connectionMutex.lock();
		return this.connection!;
	}

	async beginTransaction(connection: DatabaseConnection): Promise<void> {
		await connection.executeQuery(CompiledQuery.raw("begin"));
	}

	async commitTransaction(connection: DatabaseConnection): Promise<void> {
		await connection.executeQuery(CompiledQuery.raw("commit"));
	}

	async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
		await connection.executeQuery(CompiledQuery.raw("rollback"));
	}

	async releaseConnection(): Promise<void> {
		this.connectionMutex.unlock();
	}

	async destroy(): Promise<void> {
		this.db?.close();
	}
}
class ConnectionMutex {
	private promise?: Promise<void>;
	private resolve?: () => void;

	async lock(): Promise<void> {
		while (this.promise) {
			await this.promise;
		}

		this.promise = new Promise(resolve => {
			this.resolve = resolve;
		});
	}

	unlock(): void {
		const resolve = this.resolve;

		this.promise = undefined;
		this.resolve = undefined;

		resolve?.();
	}
}
class TauriSqlConnection implements DatabaseConnection {
	readonly db: TauriSqlDB;
	constructor(db: any) {
		this.db = db;
	}

	streamQuery<R>(): AsyncIterableIterator<KyselyQueryResult<R>> {
		throw new Error("Tauri sql plugin doesn't support streaming");
	}

	async executeQuery<R>({
		parameters,
		query,
		sql
	}: CompiledQuery<unknown>): Promise<KyselyQueryResult<R>> {
		const rows = await this.db.select<any[]>(sql, parameters as unknown[]);
		if (SelectQueryNode.is(query) || rows.length) {
			return { rows };
		}
		const { lastInsertId, rowsAffected } = await this.db.execute("select 1");
		return {
			rows,
			insertId: BigInt(lastInsertId),
			numAffectedRows: BigInt(rowsAffected)
		};
	}
}

export interface TauriSqliteDialectConfig {
	database: Promisable<TauriSqlDB>;
	onCreateConnection?: (connection: DatabaseConnection) => Promisable<void>;
}

export interface TauriSqlDB {
	execute: (query: string, bindValues?: unknown[]) => Promise<QueryResult>;
	select: <T>(query: string, bindValues?: unknown[]) => Promise<T>;
	close: () => Promise<boolean>;
}

export interface QueryResult {
	rowsAffected: number;
	lastInsertId: number;
}

export type Promisable<T> = T | Promise<T>;
