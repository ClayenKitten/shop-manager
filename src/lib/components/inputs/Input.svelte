<script lang="ts" generics="T">
	import { createEventDispatcher } from "svelte";

	export let intoString: (value: T) => string;
	export let fromString: (s: string) => T;
	export let isValid: (s: string) => boolean = () => true;

	export let value: T;
	let innerValue: string = intoString(value);
	let input: HTMLInputElement;

	$: if (input) input.value = intoString(value);

	const oninput = () => {
		innerValue = input.value;
		dispatch("input");
	};
	const onchange = () => {
		if (isValid(innerValue)) {
			value = fromString(innerValue);
			dispatch("change");
		}
		innerValue = intoString(value);
		input.value = innerValue;
	};

	let dispatch = createEventDispatcher<{ input: void; change: void }>();
</script>

<input
	bind:this={input}
	class:invalid={innerValue !== "" && !isValid(innerValue)}
	on:input={oninput}
	on:change={onchange}
/>

<style lang="scss">
	input {
		text-align: end;
		outline: 0;
		border: 0;
		&.invalid {
			color: var(--error);
		}
	}
</style>
