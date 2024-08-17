<script lang="ts">
	import Window from "$lib/components/Window.svelte";
	import type { Audit } from "$lib/data/audit";

	export let isOpen: boolean;
	export let audit: Audit | null = null;
</script>

<Window bind:isOpen header="Ревизия" />
