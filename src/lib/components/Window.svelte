<script lang="ts">
	import { closeModal } from "svelte-modals";

	export let isOpen: boolean;
	export let header: string | null = null;
</script>

{#if isOpen}
	<div class="modal">
		<article role="dialog">
			{#if header !== null}
				<header>{header}</header>
			{/if}
			<div>
				<slot />
			</div>
			<button on:click={() => closeModal()}>
				<img src="/icons/cross.svg" alt="Закрыть" />
			</button>
		</article>
	</div>
{/if}

<style lang="scss">
	.modal {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;

		display: flex;
		justify-content: center;
		align-items: center;
	}
	article {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 32px;
		padding: 40px 56px 56px 56px;

		background-color: var(--primary-bg);
		border-radius: 4px;

		position: relative;

		pointer-events: none;
		* {
			pointer-events: initial;
		}

		> header {
			flex: 0 0 content;
			font-family: "AlegreyaSans";
			font-size: 36px;
			font-weight: 500;
			line-height: 43.2px;
			color: var(--text);
		}
		> div {
			flex: 1;
		}
		> button {
			position: absolute;
			top: 0;
			right: 0;
			border: 0;
			background: none;

			display: flex;
			justify-content: center;
			align-items: center;
			width: 32px;
			height: 32px;

			> img {
				width: 12px;
				height: 12px;
			}
		}
	}
</style>
