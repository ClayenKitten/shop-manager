<script lang="ts">
	import { onMount } from "svelte";
	import { createEventDispatcher } from "svelte";

	export let message: string;
	export let kind: "info" | "success" | "error" = "info";
	export let timeToLive: number = 5;

	const dispatch = createEventDispatcher<{ close: void }>();

	let timer: NodeJS.Timeout;

	onMount(() => {
		timer = setTimeout(() => dispatch("close"), timeToLive * 1000);
		return () => clearTimeout(timer);
	});
</script>

<div class={`toast ${kind}`}>
	<div class="message">{message}</div>
	<button class="close-btn" on:click={() => dispatch("close")}>&times;</button>
</div>

<style lang="scss">
	.toast {
		padding: 16px;
		border-radius: 4px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: Arial, sans-serif;
		color: #fff;
		pointer-events: auto;

		&.info {
			background-color: #007bff;
		}

		&.success {
			background-color: #28a745;
		}

		&.error {
			background-color: #dc3545;
		}

		.message {
			flex-grow: 1;
			padding-right: 16px;
		}

		.close-btn {
			cursor: pointer;
			background: transparent;
			border: none;
			color: inherit;
			font-size: 20px;
			line-height: 1;
			outline: none;
		}
	}
</style>
