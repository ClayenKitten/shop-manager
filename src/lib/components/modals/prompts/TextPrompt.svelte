<script lang="ts">
	import { onMount } from "svelte";
	import type { Resolve } from ".";
	import Prompt from "./Prompt.svelte";

	export let header: string | null = null;
	export let placeholder: string = "";
	export let isValid: (v: string) => boolean = () => true;
	export let value: string = "";

	export let promptCallback: Resolve<string>;
	export let isOpen: boolean = false;

	let input: HTMLInputElement;
	onMount(() => input.focus());
</script>

<Prompt bind:isOpen {header} {isValid} {value} {promptCallback}>
	<input
		bind:value
		{placeholder}
		class:invalid={value !== "" && !isValid(value)}
		bind:this={input}
	/>
</Prompt>

<style lang="scss">
	input {
		font-size: 16px;
		border: 1px solid var(--separator);
		border-radius: 4px;
		padding: 8px 12px;
		&.invalid {
			border-color: var(--error);
		}
	}
</style>
