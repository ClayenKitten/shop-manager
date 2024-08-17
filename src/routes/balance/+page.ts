import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { Temporal } from "temporal-polyfill";

export const load: PageLoad = async ({ parent }) => {
	let { shops } = await parent();
	if (shops.length !== 0) {
		let shop = shops[0];
		let date = Temporal.Now.plainDateISO().toPlainYearMonth();
		redirect(307, `/balance/${shop.id}/${date.toString()}`);
	}
};
