<script lang="ts">
	export let header: string;
	export let alignment: "left" | "right" = "left";
</script>

<div class="header" style:justify-content={alignment}>{header}</div>

<style lang="scss">
	.header {
		display: flex;
		align-items: center;
		padding: 0 16px;
		height: 56px;

		font-family: "PT-Sans";
		font-size: 20px;
		font-weight: 700;
		color: var(--text-header);
		background-color: var(--header);

		white-space: nowrap;
	}
</style>
