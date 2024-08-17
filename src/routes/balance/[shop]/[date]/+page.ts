import { Temporal } from "temporal-polyfill";
import type { PageLoad } from "./$types";
import { BalanceService } from "$lib/data/balance";
import { AuditRepository } from "$lib/data/audit";
import { ShopRepository } from "$lib/data/shop";
import { error } from "@sveltejs/kit";

export const load: PageLoad = async ({ params, depends }) => {
	depends("app:balance");
	let date = Temporal.PlainYearMonth.from(params.date);
	let [shop, audits] = await Promise.all([
		new ShopRepository().get(Number(params.shop)),
		new Map(
			(await new AuditRepository().getAll()).map(x => [x.date.toString(), x])
		)
	]);
	if (!shop) error(404, { message: "Точка продаж не найдена" });

	let balances = await new BalanceService().getMonthlyBalance(date, shop);

	return {
		date,
		shop,
		balances,
		audits
	};
};
