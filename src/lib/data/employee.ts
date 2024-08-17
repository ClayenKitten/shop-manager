import { db } from "../db";

export class EmployeeRepository {
	public async getAll(): Promise<Employee[]> {
		let records = await db()
			.selectFrom("Employee")
			.select(["Employee.Id", "Employee.Name"])
			.execute();
		return records.map(({ Id, Name }) => new Employee(Id, Name));
	}

	public async create(name: string) {
		await db().insertInto("Employee").values({ Name: name }).execute();
	}

	public async update(employee: Employee) {
		await db()
			.updateTable("Employee")
			.set({ Name: employee.name })
			.where("Id", "=", employee.id)
			.execute();
	}

	public async delete(employee: Employee) {
		await db().deleteFrom("Employee").where("Id", "=", employee.id).execute();
	}
}

export class Employee {
	constructor(
		public id: number,
		public name: string
	) {}
}
