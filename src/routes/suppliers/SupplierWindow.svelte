<script lang="ts">
	import Window from "$lib/components/Window.svelte";
	import type { Supplier } from "$lib/data/supplier";

	export let isOpen: boolean;
	export let supplier: Supplier;
</script>

<Window bind:isOpen header="Поставщик" />
