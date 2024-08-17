<script lang="ts">
	import Entry from "./Entry.svelte";

	let menuOpen = false;

	let menuBtn: HTMLElement;
	let nav: HTMLElement;

	function onClick() {
		menuOpen = false;
	}
</script>

<svelte:window on:click={() => (menuOpen = false)} />

<header>
	<button
		bind:this={menuBtn}
		class="menuBtn"
		on:click={e => {
			e.stopPropagation();
			menuOpen = true;
		}}
	>
		<img src="/icons/menu.svg" alt="Меню" />
	</button>
	<div>
		<slot />
	</div>
	{#if menuOpen}
		<nav bind:this={nav}>
			<Entry
				href="/balance"
				name="Баланс торговой точки"
				icon="/icons/balance.svg"
			/>
			<Entry href="/audits" name="Ревизии" icon="/icons/audit.svg" />
			<Entry href="/shipments" name="Накладные" icon="/icons/shipment.svg" />
			<Entry href="/suppliers" name="Поставщики" icon="/icons/supplier.svg" />
			<Entry href="/employees" name="Сотрудники" icon="/icons/employee.svg" />
			<Entry href="/shops" name="Торговые точки" icon="/icons/shop.svg" />
		</nav>
	{/if}
</header>

<style lang="scss">
	header {
		display: flex;
		gap: 36px;
		position: relative;

		> .menuBtn,
		> .menuBtn > img {
			width: 46px;
			height: 46px;
			-webkit-user-drag: none;
		}

		> button {
			border: 0;
			background: none;
		}

		> nav {
			display: flex;
			flex-direction: column;
			padding: 22px 0;
			background-color: var(--primary-bg);
			border-radius: 4px;

			position: absolute;
			top: 60px;
			left: 0;
		}

		div {
			display: flex;
			gap: 12px;

			font-family: "AlegreyaSans";
			font-weight: 700;
			font-size: 40px;
			line-height: 48px;
			color: var(--header);
		}
	}
</style>
