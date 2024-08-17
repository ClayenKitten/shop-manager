<script lang="ts">
	import currency from "currency.js";
	import Input from "./Input.svelte";

	export let value: currency;

	export let min: number = 0;
	export let max: number | null = null;

	const isValid = (s: string) => {
		const regex = /^\d+(\.\d?\d?)?$/;
		return (
			regex.test(s) && Number(s) >= min && (max === null || Number(s) <= max)
		);
	};
</script>

<Input
	bind:value
	fromString={s => currency(Number.parseFloat(s))}
	intoString={n => n.toString()}
	{isValid}
	on:input
	on:change
/>
