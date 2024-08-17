import { AuditRepository } from "$lib/data/audit";
import { EmployeeRepository } from "$lib/data/employee";
import { ShipmentRepository } from "$lib/data/shipment";
import { ShopRepository } from "$lib/data/shop";
import { SupplierRepository } from "$lib/data/supplier";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
	return {
		audits: await new AuditRepository().getAll(),
		shipments: await new ShipmentRepository().getAll(),
		shops: await new ShopRepository().getAll(),
		employees: await new EmployeeRepository().getAll(),
		suppliers: await new SupplierRepository().getAll()
	};
};

export const prerender = true;
export const ssr = false;
