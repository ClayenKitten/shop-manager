<script lang="ts">
	import { closeModal, Modals } from "svelte-modals";
	import "../app.scss";
	import Toasts from "$lib/components/modals/notifications/Toasts.svelte";
</script>

<Toasts />
<Modals>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div slot="backdrop" class="backdrop" on:click={closeModal} />
</Modals>
<div id="wrapper">
	<slot />
</div>

<style lang="scss">
	#wrapper {
		display: flex;
		flex-direction: column;
		width: 100vw;
		height: 100vh;
		background-color: var(--main-bg);
		padding: 40px;
		overflow: hidden;
	}

	.backdrop {
		position: fixed;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		background: var(--header);
		opacity: 0.56;
	}
</style>
