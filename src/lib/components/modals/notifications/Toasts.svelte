<script lang="ts">
	import { toastState, type Notification } from ".";
	import Toast from "./Toast.svelte";
	import { onDestroy, onMount } from "svelte";

	let toasts: Notification[] = [];

	onMount(() => {
		const unsubscribe = toastState.subscribe(value => (toasts = value));
		return unsubscribe;
	});

	function close(id: number) {
		toastState.update(toasts => toasts.filter(toast => toast.id !== id));
	}
</script>

<div>
	{#each toasts as toast (toast.id)}
		<Toast
			message={toast.message}
			kind={toast.kind}
			timeToLive={toast.timeToLive}
			on:close={() => close(toast.id)}
		/>
	{/each}
</div>

<style lang="scss">
	div {
		position: absolute;
		bottom: 20px;
		right: 20px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 8px;
		pointer-events: none;
	}
</style>
