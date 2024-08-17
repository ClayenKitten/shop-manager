<script lang="ts" generics="T">
	import { createEventDispatcher } from "svelte";

	export let placeholder: string;
	export let selected: T | null;
	export let options: T[];

	export let display: ((x: T) => string) | undefined = undefined;

	const dispatch = createEventDispatcher<{ change: T }>();

	function optionToString(x: T) {
		if (display !== undefined) return display(x);
		return x + "";
	}
</script>

<div class="combobox">
	<button>
		<span>
			{#if selected === null}
				{placeholder}
			{:else}
				{optionToString(selected)}
			{/if}
		</span>
		<img alt="" />
	</button>
	<ul class="options">
		{#each options as option}
			<button
				on:click={() => {
					selected = option;
					dispatch("change", option);
				}}
			>
				{optionToString(option)}
			</button>
		{/each}
	</ul>
</div>

<style lang="scss">
	.combobox {
		display: inline-flex;
		position: relative;
		> button {
			display: flex;
			align-items: center;
			gap: 16px;

			color: inherit;
			background: none;
			border: 0;

			> span {
				padding: 0 4px 2px 4px;
				margin-bottom: -2px;
				border-bottom: 2px solid var(--text);
			}
			> img {
				content: url(/icons/arrow_down.svg);
				width: 14px;
				height: 14px;
			}
			&:focus-within > img {
				content: url(/icons/arrow_up.svg);
				width: 14px;
				height: 14px;
			}
		}
		> .options {
			display: none;
		}
		&:focus-within > .options {
			display: flex;
			flex-direction: column;

			position: absolute;
			top: calc(100% + 12px);
			z-index: 1;

			max-height: 120px;
			max-width: 200px;
			padding: 6px 0;

			overflow: auto;

			font-size: 20px;
			font-weight: 400;

			background-color: white;
			border-radius: 4px;

			> button {
				flex: 0 0 content;
				display: flex;
				justify-content: center;
				align-items: center;

				color: var(--text);
				background-color: white;
				border-radius: 0;
				border: 0;
				padding: 4px 16px;

				&:hover {
					background-color: var(--primary-bg-hover);
				}
			}
		}
	}
</style>
