import { Temporal } from "temporal-polyfill";
import { db } from "../db";
import { ShipmentRepository, type Shipment } from "./shipment";
import { ShopRepository, type Shop } from "./shop";
import currency from "currency.js";
import { Audit, AuditRepository } from "./audit";
import type { Selectable } from "kysely";
import type { DB } from "kysely-codegen";

export class BalanceService {
	public async get(date: Temporal.PlainDate, shop: Shop): Promise<Balance> {
		let record = await db()
			.selectFrom("Balance")
			.selectAll()
			.where("Date", "=", date.toString())
			.where("ShopId", "=", shop.id)
			.executeTakeFirst();
		let shipments = await new ShipmentRepository().getAll({ date, shop });
		if (record === undefined) {
			return new Balance(
				date,
				shop,
				currency(0),
				currency(0),
				new Revaluation(currency(0), currency(0)),
				shipments
			);
		}
		return this.mapRecord(record);
	}

	/** Calculates balances for the provided month. */
	public async getMonthlyBalance(
		date: Temporal.PlainYearMonth,
		shop: Shop
	): Promise<Map<string, CalculatedBalance>> {
		let startDate = date.toPlainDate({ day: 1 });
		let endDate = date.toPlainDate({ day: date.daysInMonth });

		let latestAudit = await new AuditRepository().getClosest(startDate, shop);
		let sum = latestAudit ? latestAudit.balance : currency(0);
		let currentDay = latestAudit
			? latestAudit.date.add(new Temporal.Duration(0, 0, 0, 1))
			: startDate;

		let result = new Map<string, CalculatedBalance>();
		while (Temporal.PlainDate.compare(currentDay, endDate) <= 0) {
			let balance = await this.get(currentDay, shop);
			sum = sum.add(balance.change);
			if (Temporal.PlainDate.compare(currentDay, startDate) >= 0) {
				result.set(currentDay.toString(), { balance, sum });
			}

			let audit = await new AuditRepository().get(currentDay, shop);
			if (audit) sum = audit.balance;

			currentDay = currentDay.add(new Temporal.Duration(0, 0, 0, 1));
		}
		return result;
	}

	/**
	 * Updates or creates balance records in database.
	 *
	 * Does not update shipments.
	 * */
	public async set(balance: Balance) {
		await db()
			.insertInto("Balance")
			.values({
				Date: balance.date.toString(),
				ShopId: balance.shop.id,
				Cash: balance.cash.value,
				Card: balance.card.value,
				ReevaluationAdd: balance.revaluation.add.value,
				ReevaluationSub: balance.revaluation.sub.value
			})
			.onConflict(c =>
				c.columns(["Date", "ShopId"]).doUpdateSet({
					Cash: balance.cash.value,
					Card: balance.card.value,
					ReevaluationAdd: balance.revaluation.add.value,
					ReevaluationSub: balance.revaluation.sub.value
				})
			)
			.execute();
	}

	private async mapRecord(record: Selectable<DB["Balance"]>): Promise<Balance> {
		let date = Temporal.PlainDate.from(record.Date);
		let shop = (await new ShopRepository().get(record.ShopId))!;
		let shipments = await new ShipmentRepository().getAll({
			date,
			shop
		});
		return new Balance(
			date,
			shop,
			currency(record.Cash),
			currency(record.Card),
			new Revaluation(
				currency(record.ReevaluationAdd),
				currency(record.ReevaluationSub)
			),
			shipments
		);
	}
}

export class Balance {
	constructor(
		public date: Temporal.PlainDate,
		public shop: Shop,
		public cash: currency,
		public card: currency,
		public revaluation: Revaluation,
		public shipments: Shipment[]
	) {}

	public get revenue() {
		return this.cash.add(this.card);
	}

	public get shipmentsCost() {
		return this.shipments.reduce(
			(sum, shipment) => (sum = sum.add(shipment.cost)),
			currency(0)
		);
	}

	public get change() {
		return this.revenue
			.subtract(this.shipmentsCost)
			.add(this.revaluation.value);
	}
}

export type CalculatedBalance = { balance: Balance; sum: currency };

export class Revaluation {
	constructor(
		public add: currency,
		public sub: currency
	) {}

	public get value(): currency {
		return this.add.subtract(this.sub);
	}
}
