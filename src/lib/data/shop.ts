import { db } from "../db";

export class ShopRepository {
	public async get(id: number): Promise<Shop | undefined> {
		let record = await db()
			.selectFrom("Shop")
			.selectAll()
			.where("Id", "=", id)
			.executeTakeFirst();
		if (record === undefined) return undefined;
		return new Shop(record.Id, record.Name);
	}

	public async getAll(): Promise<Shop[]> {
		let records = await db().selectFrom("Shop").selectAll().execute();
		return records.map(({ Id, Name }) => new Shop(Id, Name));
	}

	public async create(name: string) {
		await db().insertInto("Shop").values({ Name: name }).execute();
	}

	public async update(shop: Shop) {
		await db()
			.updateTable("Shop")
			.set({ Name: shop.name })
			.where("Id", "=", shop.id)
			.execute();
	}

	public async delete(shop: Shop) {
		await db().deleteFrom("Shop").where("Id", "=", shop.id).execute();
	}
}

export class Shop {
	constructor(
		public id: number,
		public name: string
	) {}
}
