<script lang="ts" generics="T">
	import { closeModal } from "svelte-modals";
	import type { Resolve } from ".";

	export let header: string | null = null;
	export let isValid: (v: T) => boolean = () => true;
	export let value: T;

	export let promptCallback: Resolve<T>;
	export let isOpen: boolean = false;

	const cancel = () => {
		closeModal();
	};
	const ok = () => {
		closeModal();
		promptCallback(value);
	};
</script>

<svelte:window
	on:keyup={e => {
		if (e.code === "Escape") {
			cancel();
		} else if (e.code === "Enter" && isValid(value)) {
			ok();
		}
	}}
/>

{#if isOpen}
	<div class="modal">
		<article role="dialog">
			{#if header !== null}
				<header>{header}</header>
			{/if}
			<div>
				<slot />
			</div>
			<footer>
				<button class="ok" on:click={ok} disabled={!isValid(value)}>Ок</button>
				<button class="cancel" on:click={cancel}>Отмена</button>
			</footer>
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
		gap: 24px;
		padding: 20px;

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
			font-size: 24px;
			font-weight: 500;
			color: var(--text);
		}

		> div {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-self: stretch;
		}

		> footer {
			display: flex;
			flex-direction: row-reverse;
			justify-content: end;
			align-self: flex-end;
			gap: 8px;
			> button {
				padding: 4px 12px;
				border: 1px solid var(--separator);
				border-radius: 4px;
				min-width: 60px;
				&.ok {
					color: white;
					background-color: var(--header);
					border-color: var(--header);
					&:hover {
						background-color: var(--primary-hover);
						border-color: var(--primary-hover);
					}
				}
				&.cancel {
					background-color: var(--secondary);
					&:hover {
						background-color: var(--secondary-hover);
					}
				}
			}
		}
	}
</style>
