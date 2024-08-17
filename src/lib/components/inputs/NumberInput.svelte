<script lang="ts">
	import Input from "./Input.svelte";

	export let value: number;
	export let min: number | null = null;
	export let max: number | null = null;

	const isValid = (s: string) => {
		const regex = /^-?\d+(\.\d*)?$/;
		return (
			regex.test(s) &&
			(min === null || Number(s) >= min) &&
			(max === null || Number(s) <= max)
		);
	};
</script>

<Input
	bind:value
	fromString={s => Number(s)}
	intoString={n => n.toFixed(2)}
	{isValid}
	on:input
	on:change
/>
