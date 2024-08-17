<script lang="ts">
	import { BalanceService, type CalculatedBalance } from "$lib/data/balance";
	import Extended from "./Extended.svelte";
	import CurrencyInput from "$lib/components/inputs/CurrencyInput.svelte";
	import { invalidate } from "$app/navigation";

	export let calculatedBalance: CalculatedBalance;
	$: balance = calculatedBalance.balance;
	$: sum = calculatedBalance.sum;

	let open = false;

	const update = async () => {
		await new BalanceService().set(balance);
		await invalidate("app:balance");
	};
</script>

<div class="cell">
	<button on:click={() => (open = !open)}>
		<img
			src={`/icons/arrow_${open ? "down" : "right"}.svg`}
			alt={open ? "Закрыть" : "Открыть"}
		/>
	</button>
	<span>{balance.date.toLocaleString()}</span>
</div>
<div class="cell right">{balance.revenue}</div>
<div class="cell right">{balance.shipmentsCost}</div>
<div class="cell right revaluation">
	<img src="/icons/revaluation_up.svg" alt="Переоценка +" />
	<CurrencyInput bind:value={balance.revaluation.add} on:change={update} />
	<img src="/icons/revaluation_down.svg" alt="Переоценка -" />
	<CurrencyInput bind:value={balance.revaluation.sub} on:change={update} />
</div>
<div class="cell right">{sum}</div>
{#if open}
	<Extended bind:balance on:change={update} />
{/if}

<style lang="scss">
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

		&:not(:last-of-type) {
			border-bottom: 1px solid var(--separator);
		}

		> button {
			background: none;
			border: 0;
			margin-right: 16px;
			> img {
				width: 14px;
				height: 14px;
			}
		}

		&.right {
			justify-content: right;
		}

		&.revaluation {
			> img {
				margin: 0 8px 0 20px;
			}
			:global(input) {
				border: 0;
				width: 80px;
				text-align: right;
			}
		}
	}
</style>
