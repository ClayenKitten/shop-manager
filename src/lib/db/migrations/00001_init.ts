import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	db.schema
		.createTable("Shop")
		.addColumn("Id", "integer", col =>
			col.primaryKey().notNull().autoIncrement()
		)
		.addColumn("Name", "text", col => col.notNull())
		.execute();
	db.schema
		.createTable("Employee")
		.addColumn("Id", "integer", col =>
			col.primaryKey().notNull().autoIncrement()
		)
		.addColumn("Name", "text", col => col.notNull())
		.execute();
	db.schema
		.createTable("Supplier")
		.addColumn("Id", "integer", col =>
			col.primaryKey().notNull().autoIncrement()
		)
		.addColumn("Name", "text", col => col.notNull())
		.execute();

	db.schema
		.createTable("Audit")
		.addColumn("Id", "integer", col =>
			col.primaryKey().notNull().autoIncrement()
		)
		.addColumn("Date", "date", col => col.notNull())
		.addColumn("ShopId", "integer", col =>
			col.references("Shop.Id").onDelete("restrict").notNull()
		)
		.addColumn("Remainder", "integer", col => col.notNull())
		.addUniqueConstraint("AuditUnique", ["Date", "ShopId"])
		.execute();
	db.schema
		.createTable("AuditEntries")
		.addColumn("Id", "integer", col =>
			col.primaryKey().notNull().autoIncrement()
		)
		.addColumn("AuditId", "integer", col =>
			col.references("Audit.Id").onDelete("cascade").notNull()
		)
		.addColumn("Amount", "integer", col => col.notNull())
		.addColumn("Price", "integer", col => col.notNull())
		.execute();

	db.schema
		.createTable("Shipment")
		.addColumn("Id", "integer", col =>
			col.primaryKey().notNull().autoIncrement()
		)
		.addColumn("Date", "date", col => col.notNull())
		.addColumn("ShopId", "integer", col =>
			col.references("Shop.Id").onDelete("restrict").notNull()
		)
		.addColumn("SupplierId", "integer", col =>
			col.references("Supplier.Id").onDelete("restrict").notNull()
		)
		.execute();
	db.schema
		.createTable("ShipmentEntries")
		.addColumn("Id", "integer", col =>
			col.primaryKey().notNull().autoIncrement()
		)
		.addColumn("ShipmentId", "integer", col =>
			col.references("Shipment.Id").onDelete("cascade").notNull()
		)
		.addColumn("Amount", "integer", col => col.notNull())
		.addColumn("Price", "integer", col => col.notNull())
		.execute();

	db.schema
		.createTable("Balance")
		.addColumn("Date", "date", col => col.notNull())
		.addColumn("ShopId", "integer", col =>
			col.references("Shop.Id").onDelete("restrict").notNull()
		)
		.addColumn("Cash", "integer", col => col.notNull())
		.addColumn("Card", "integer", col => col.notNull())
		.addColumn("ReevaluationAdd", "integer", col => col.notNull())
		.addColumn("ReevaluationSub", "integer", col => col.notNull())
		.addPrimaryKeyConstraint("BalancePK", ["Date", "ShopId"])
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	const tables = [
		"ShipmentEntries",
		"Shipment",
		"AuditEntries",
		"Audit",
		"Balance",
		"Shop",
		"Employee",
		"Supplier"
	];
	for (const table of tables) {
		await db.schema.dropTable(table).execute();
	}
}
