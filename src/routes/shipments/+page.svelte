<script lang="ts">
	import DataGrid from "$lib/components/datagrid/DataGrid.svelte";
	import DataGridHeader from "$lib/components/datagrid/DataGridHeader.svelte";
	import Header from "$lib/components/header/Header.svelte";
	import { openModal } from "svelte-modals";
	import type { PageData } from "./$types";
	import ShipmentWindow from "./ShipmentWindow.svelte";

	export let data: PageData;
</script>

<Header>Накладные</Header>
<main>
	<DataGrid columns={["1fr", "3fr", "3fr", "2fr"]}>
		<svelte:fragment slot="header">
			<DataGridHeader header="Дата" />
			<DataGridHeader header="Точка продаж" />
			<DataGridHeader header="Поставщик" />
			<DataGridHeader header="Общая стоимость, ₽" alignment="right" />
		</svelte:fragment>
		<svelte:fragment slot="rows">
			{#each data.shipments as shipment}
				<span class="cell">{shipment.date.toLocaleString()}</span>
				<span class="cell">{shipment.shop.name}</span>
				<span class="cell">{shipment.supplier.name}</span>
				<span class="cell right">{shipment.cost}</span>
			{/each}
		</svelte:fragment>
	</DataGrid>
	<button on:click={() => openModal(ShipmentWindow)}>Добавить накладную</button>
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
	}
</style>
