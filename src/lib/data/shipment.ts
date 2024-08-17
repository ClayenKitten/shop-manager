import { Shop, ShopRepository } from "./shop";
import { Supplier, SupplierRepository } from "./supplier";
import { db } from "../db";
import { Temporal } from "temporal-polyfill";
import currency from "currency.js";

export class Shipment {
	constructor(
		public id: number,
		public date: Temporal.PlainDate,
		public shop: Shop,
		public supplier: Supplier,
		public entries: ShipmentEntry[]
	) {}

	public get cost(): currency {
		return this.entries.reduce((a, b) => a.add(b.cost), currency(0));
	}
}

export class ShipmentEntry {
	constructor(
		public price: currency,
		public amount: number
	) {}

	public get cost(): currency {
		return this.price.multiply(this.amount);
	}
}

export class ShipmentRepository {
	public async getAll(filters?: {
		date?: Temporal.PlainDate;
		shop?: Shop;
		supplier?: Supplier;
	}): Promise<Shipment[]> {
		let query = db()
			.selectFrom("Shipment")
			.select(["Id", "Date", "ShopId", "SupplierId"])
			.orderBy("Date", "desc");
		if (filters?.date !== undefined) {
			query = query.where("Date", "=", filters.date.toString());
		}
		if (filters?.shop !== undefined) {
			query = query.where("ShopId", "=", filters.shop.id);
		}
		if (filters?.supplier !== undefined) {
			query = query.where("SupplierId", "=", filters.supplier.id);
		}

		let records = await query.execute();
		return await Promise.all(
			records.map(async ({ Id, Date: date, ShopId, SupplierId }) => {
				let shop = await new ShopRepository().get(ShopId);
				let supplier = await new SupplierRepository().get(SupplierId);
				return new Shipment(
					Id,
					Temporal.PlainDate.from(date),
					shop!,
					supplier!,
					await this.getEntries(Id)
				);
			})
		);
	}

	private async getEntries(shipmentId: number): Promise<ShipmentEntry[]> {
		let records = await db()
			.selectFrom("ShipmentEntries")
			.selectAll()
			.where("ShipmentId", "=", shipmentId)
			.execute();
		return records.map(
			({ Price, Amount }) => new ShipmentEntry(currency(Price), Amount)
		);
	}

	public async create(
		date: Temporal.PlainDate,
		shop: Shop,
		supplier: Supplier
	) {
		await db()
			.insertInto("Shipment")
			.values({
				Date: date.toString(),
				ShopId: shop.id,
				SupplierId: supplier.id
			})
			.execute();
	}

	public async delete(shipment: Shipment) {
		await db().deleteFrom("Shipment").where("Id", "=", shipment.id).execute();
	}
}
