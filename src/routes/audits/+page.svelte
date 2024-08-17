<script lang="ts">
	import DataGrid from "$lib/components/datagrid/DataGrid.svelte";
	import DataGridHeader from "$lib/components/datagrid/DataGridHeader.svelte";
	import Header from "$lib/components/header/Header.svelte";
	import { openModal } from "svelte-modals";
	import type { PageData } from "./$types";
	import AuditWindow from "./AuditWindow.svelte";

	export let data: PageData;
</script>

<Header>Ревизии</Header>
<main>
	<DataGrid columns={["1fr", "2fr", "2fr", "2fr", "2fr"]}>
		<svelte:fragment slot="header">
			<DataGridHeader header="Дата" />
			<DataGridHeader header="Точка продаж" />
			<DataGridHeader header="В кассе, ₽" alignment="right" />
			<DataGridHeader header="Стоимость, ₽" alignment="right" />
			<DataGridHeader header="Баланс, ₽" alignment="right" />
		</svelte:fragment>
		<svelte:fragment slot="rows">
			{#each data.audits as audit}
				<span class="cell">{audit.date.toLocaleString()}</span>
				<span class="cell">{audit.shop.name}</span>
				<span class="cell right">{audit.cash}</span>
				<span class="cell right">{audit.cost}</span>
				<span class="cell right">{audit.balance}</span>
			{/each}
		</svelte:fragment>
	</DataGrid>
	<button on:click={() => openModal(AuditWindow)}>Добавить ревизию</button>
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
