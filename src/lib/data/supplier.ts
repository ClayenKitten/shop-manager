import { db } from "../db";

export class Supplier {
	constructor(
		public id: number,
		public name: string
	) {}
}

export class SupplierRepository {
	public async get(id: number): Promise<Supplier | undefined> {
		let record = await db()
			.selectFrom("Supplier")
			.selectAll()
			.where("Id", "=", id)
			.executeTakeFirst();
		if (record === undefined) return undefined;
		return new Supplier(record.Id, record.Name);
	}

	public async getAll(): Promise<Supplier[]> {
		let records = await db()
			.selectFrom("Supplier")
			.select(["Supplier.Id", "Supplier.Name"])
			.execute();
		return records.map(({ Id, Name }) => new Supplier(Id, Name));
	}

	public async create(name: string) {
		await db().insertInto("Supplier").values({ Name: name }).execute();
	}

	public async update(supplier: Supplier) {
		await db()
			.updateTable("Supplier")
			.set({ Name: supplier.name })
			.where("Id", "=", supplier.id)
			.execute();
	}

	public async delete(supplier: Supplier) {
		await db().deleteFrom("Supplier").where("Id", "=", supplier.id).execute();
	}
}
