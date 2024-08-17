<script lang="ts">
	import { goto } from "$app/navigation";
	import ComboBox from "$lib/components/ComboBox.svelte";
	import DataGrid from "$lib/components/datagrid/DataGrid.svelte";
	import DataGridHeader from "$lib/components/datagrid/DataGridHeader.svelte";
	import Header from "$lib/components/header/Header.svelte";
	import { monthToName, range } from "$lib/util";
	import type { PageData } from "./$types";
	import AuditRow from "./AuditRow.svelte";
	import Row from "./Row.svelte";
	import { Temporal } from "temporal-polyfill";

	export let data: PageData;

	let months = range(1, 12 + 1);
	let years = range(2024, Temporal.Now.plainDateISO().year + 3);

	function daysOfMonth(date: Temporal.PlainYearMonth) {
		let result = [];
		for (let day = 1; day <= date.daysInMonth; day++) {
			result.push(date.toPlainDate({ day }));
		}
		return result;
	}

	const getBalance = (date: Temporal.PlainDate) => {
		return data.balances.get(date.toString())!;
	};
</script>

<Header>
	<span>
		Баланс торговой точки
		<ComboBox
			selected={data.shop}
			options={data.shops}
			placeholder="Точка"
			display={shop => shop.name}
			on:change={e => goto(`/balance/${e.detail.id}/${data.date.toString()}`)}
		/>
	</span>
</Header>
<main>
	<menu>
		<ComboBox
			selected={data.date.month}
			options={months}
			placeholder="Месяц"
			display={monthToName}
			on:change={e =>
				goto(
					`/balance/${data.shop.id}/${new Temporal.PlainYearMonth(data.date.year, e.detail).toString()}`
				)}
		/>
		<ComboBox
			selected={data.date.year}
			options={years}
			placeholder="Год"
			on:change={e =>
				goto(
					`/balance/${data.shop.id}/${new Temporal.PlainYearMonth(e.detail, data.date.month).toString()}`
				)}
		/>
	</menu>
	<div>
		<DataGrid
			columns={["0fr", "2fr", "2fr", ["360px", "2fr"], "1fr"]}
			minWidth={240}
		>
			<svelte:fragment slot="header">
				<DataGridHeader header="Дата" />
				<DataGridHeader header="Выручка, ₽" alignment="right" />
				<DataGridHeader header="Накладные, ₽" alignment="right" />
				<DataGridHeader header="Переоценка, ₽" alignment="right" />
				<DataGridHeader header="Баланс, ₽" alignment="right" />
			</svelte:fragment>
			<svelte:fragment slot="rows">
				{#each daysOfMonth(data.date) as date}
					<Row calculatedBalance={getBalance(date)} />
					{@const audit = data.audits.get(date.toString())}
					{#if audit !== undefined}
						<AuditRow {audit} />
					{/if}
				{/each}
			</svelte:fragment>
			<svelte:fragment slot="footer">
				<span class=""></span>
				<span class=""></span>
				<span class=""></span>
			</svelte:fragment>
		</DataGrid>
	</div>
</main>

<style lang="scss">
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-top: 24px;
		> menu {
			display: flex;
			justify-content: end;
			gap: 16px;
			font-size: 20px;
			font-weight: 500;
			margin: 0 0 12px 0;

			:global(.combobox) {
				border-bottom: 2px solid var(--text);
				margin-bottom: -2px;
			}
			:global(.combobox > button > span) {
				text-align: left;
				border-bottom: 0;
				margin-bottom: 0;
			}
			:global(.combobox:first-of-type > button > span) {
				min-width: 100px;
			}
		}
		> div {
			display: flex;
			flex-direction: column;
			flex: 1 1 0;
			overflow: auto;
		}
	}
</style>
