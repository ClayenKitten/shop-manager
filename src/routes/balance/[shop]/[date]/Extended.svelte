<script lang="ts">
	import CurrencyInput from "$lib/components/inputs/CurrencyInput.svelte";
	import type { Balance } from "$lib/data/balance";

	export let balance: Balance;
</script>

<div class="child"></div>
<div class="child">
	<label for={undefined}>
		<span>Наличные</span>
		<CurrencyInput bind:value={balance.cash} on:change />
	</label>
	<label for={undefined}>
		<span>Безналичные</span>
		<CurrencyInput bind:value={balance.card} on:change />
	</label>
</div>
<div class="child shipments">
	<div>
		{#each balance.shipments as shipment}
			<button>{shipment.cost}</button>
		{/each}
		<button class="add">
			<img src="/icons/plus_circle.svg" alt="Добавить" />
		</button>
	</div>
</div>
<div class="child"></div>
<div class="child"></div>

<style lang="scss">
	.child {
		display: flex;
		flex-direction: column;

		font-family: "Roboto";
		font-size: 20px;
		font-weight: 400;

		color: var(--text);
		background-color: white;
		border-top: 1px dashed var(--separator);
		padding: 16px 8px;
		box-shadow:
			4px 4px 4px #0c0c0d0d,
			32px 16px 32px #0c0c0d1a;
		z-index: 1;

		> label {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10px 0;
			:global(input) {
				width: 80px;
			}
		}

		&.shipments {
			display: flex;
			flex-direction: column;
			align-items: end;
			gap: 10px;
			> div {
				display: flex;
				flex-direction: column;
				gap: 10px;
			}
			button {
				border: 1px solid var(--text);
				border-radius: 30px;
				padding: 10px;
				background-color: white;
				&.add {
					width: 32px;
					height: 32px;
					min-width: 0;
					border: 0;
					padding: 0;
					align-self: center;
					> img {
						width: 32px;
						height: 32px;
					}
				}
			}
		}
	}
</style>
