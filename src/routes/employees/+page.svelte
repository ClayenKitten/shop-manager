<script lang="ts">
	import DataGrid from "$lib/components/datagrid/DataGrid.svelte";
	import DataGridHeader from "$lib/components/datagrid/DataGridHeader.svelte";
	import Header from "$lib/components/header/Header.svelte";
	import type { PageData } from "./$types";
	import createToastNotification from "$lib/components/modals/notifications";
	import createPrompt from "$lib/components/modals/prompts";
	import TextPrompt from "$lib/components/modals/prompts/TextPrompt.svelte";
	import { EmployeeRepository, type Employee } from "$lib/data/employee";
	import { invalidateAll } from "$app/navigation";

	export let data: PageData;
	async function create() {
		createPrompt(TextPrompt, {
			header: "Создание сотрудника",
			placeholder: "Имя сотрудника",
			isValid: s => s.length !== 0
		}).then(async name => {
			try {
				await new EmployeeRepository().create(name);
				createToastNotification(`Сотрудник «${name}» создан`, "success");
			} catch {
				createToastNotification(
					`Не удалось создать сотрудника «${name}»`,
					"error"
				);
			}

			await invalidateAll();
		});
	}
	async function rename(employee: Employee) {
		createPrompt(TextPrompt, {
			header: "Переименование сотрудника",
			placeholder: "Новое имя сотрудника",
			value: employee.name,
			isValid: s => s.length !== 0
		}).then(async name => {
			let oldName = employee.name;
			employee.name = name;
			try {
				await new EmployeeRepository().update(employee);
				createToastNotification(
					`Сотрудник «${oldName}» переименован в «${employee.name}»`,
					"success"
				);
			} catch {
				createToastNotification(
					`Не удалось переименовать сотрудника «${name}»`,
					"error"
				);
			}
			await invalidateAll();
		});
	}
	async function remove(employee: Employee) {
		try {
			await new EmployeeRepository().delete(employee);
			createToastNotification(`Сотрудник «${employee.name}» удалён`, "success");
		} catch {
			createToastNotification(
				`Не удалось удалить сотрудника «${employee.name}»`,
				"error"
			);
		}
		await invalidateAll();
	}
</script>

<Header>Сотрудники</Header>
<main>
	<DataGrid columns={["1fr", "100px"]}>
		<svelte:fragment slot="header">
			<DataGridHeader header="Имя" />
			<DataGridHeader header="" />
		</svelte:fragment>
		<svelte:fragment slot="rows">
			{#each data.employees as employee}
				<span class="cell">{employee.name}</span>
				<div class="cell right">
					<button on:click={() => rename(employee)}>
						<img src="/icons/pencil.svg" alt="Изменить" />
					</button>
					<button on:click={() => remove(employee)}>
						<img src="/icons/trash.svg" alt="Удалить" />
					</button>
				</div>
			{/each}
		</svelte:fragment>
	</DataGrid>
	<button on:click={create}>Добавить сотрудника</button>
</main>

<style lang="scss">
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		flex: 1 1 0;
		overflow: auto;
		margin-top: 24px;

		> button {
			color: white;
			font-family: "AlegreyaSans";
			font-size: 20px;
			font-weight: 500;
			line-height: 24px;
			padding: 16px 40px;
			background-color: var(--header);
			border: 0;
			border-radius: 4px;
			margin-top: 18px;
			align-self: flex-end;
		}
	}

	.cell {
		display: flex;
		justify-content: left;
		align-items: center;
		padding: 0 16px;
		height: 56px;

		font-family: "Roboto";
		font-size: 20px;
		font-weight: 400;

		color: var(--text);
		background-color: white;
		border-bottom: 1px solid var(--separator);

		&.right {
			justify-content: right;
		}

		> button {
			display: flex;
			padding: 8px;
			border: 0;
			background-color: var(--secondary);
			border-radius: 4px;
			&:hover {
				background-color: var(--secondary-hover);
			}
			> img {
				width: 28px;
				height: 28px;
			}
		}
	}
</style>
