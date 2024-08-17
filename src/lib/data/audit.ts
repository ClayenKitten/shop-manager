import { db } from "$lib/db";
import { Temporal } from "temporal-polyfill";
import { ShopRepository, type Shop } from "./shop";
import currency from "currency.js";

export class AuditRepository {
	public async getAll(): Promise<Audit[]> {
		let records = await db()
			.selectFrom("Audit")
			.selectAll()
			.orderBy("Date", "desc")
			.execute();
		return await Promise.all(
			records.map(
				async record =>
					new Audit(
						record.Id,
						Temporal.PlainDate.from(record.Date),
						(await new ShopRepository().get(record.ShopId))!,
						currency(record.Remainder),
						await this.getEntries(record.Id)
					)
			)
		);
	}

	public async get(
		date: Temporal.PlainDate,
		shop: Shop
	): Promise<Audit | undefined> {
		let record = await db()
			.selectFrom("Audit")
			.selectAll()
			.where("Date", "=", date.toString())
			.where("ShopId", "=", shop.id)
			.executeTakeFirst();
		if (record === undefined) return undefined;
		return new Audit(
			record.Id,
			Temporal.PlainDate.from(record.Date),
			(await new ShopRepository().get(record.ShopId))!,
			currency(record.Remainder),
			await this.getEntries(record.Id)
		);
	}

	/** Returns closest audit before `date`. */
	public async getClosest(
		date: Temporal.PlainDate,
		shop: Shop
	): Promise<Audit | undefined> {
		let record = await db()
			.selectFrom("Audit")
			.selectAll()
			.where("Date", "<", date.toString())
			.where("ShopId", "=", shop.id)
			.orderBy("Date desc")
			.executeTakeFirst();
		if (record === undefined) return undefined;
		return new Audit(
			record.Id,
			Temporal.PlainDate.from(record.Date),
			(await new ShopRepository().get(record.ShopId))!,
			currency(record.Remainder),
			await this.getEntries(record.Id)
		);
	}

	private async getEntries(auditId: number): Promise<AuditEntry[]> {
		let records = await db()
			.selectFrom("AuditEntries")
			.selectAll()
			.where("AuditId", "=", auditId)
			.execute();
		return records.map(
			({ Price, Amount }) => new AuditEntry(currency(Price), Amount)
		);
	}
}

/**
 * Audit of the shop.
 *
 * Resets current balance of the shop.
 * */
export class Audit {
	constructor(
		public id: number,
		public date: Temporal.PlainDate,
		public shop: Shop,
		/** Remaining money in cash register. */
		public cash: currency,
		public entries: AuditEntry[]
	) {}

	/** Balance after the revision. */
	public get balance(): currency {
		return this.cost.add(this.cash);
	}

	public get cost(): currency {
		return this.entries.reduce((a, b) => a.add(b.cost), currency(0));
	}
}

export class AuditEntry {
	constructor(
		public price: currency,
		public amount: number
	) {}

	public get cost(): currency {
		return this.price.multiply(this.amount);
	}
}
