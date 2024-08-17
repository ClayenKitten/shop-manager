<script lang="ts">
	import Window from "$lib/components/Window.svelte";
	import type { Shipment } from "$lib/data/shipment";

	export let isOpen: boolean;
	export let shipment: Shipment | null = null;
</script>

<Window bind:isOpen header="Накладная" />
