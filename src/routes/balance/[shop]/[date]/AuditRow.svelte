<script lang="ts">
	import type { Audit } from "$lib/data/audit";

	export let audit: Audit;
</script>

<button class="auditRow">
	<span>Ревизия</span>
	<span>{audit.balance}</span>
</button>

<style lang="scss">
	.auditRow {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 16px 0 46px;
		height: 56px;
		grid-column: 1 / -1;

		font-family: "Roboto";
		font-size: 20px;
		font-weight: 700;

		color: white;
		background-color: var(--text);
		border: 0;
	}
</style>
