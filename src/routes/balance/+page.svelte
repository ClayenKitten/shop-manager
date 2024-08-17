<script lang="ts">
	import Header from "$lib/components/header/Header.svelte";
</script>

<Header>Баланс торговой точки</Header>

<main>
	<p>Необходимо создать торговую точку</p>
	<a href="/shops">К списку торговых точек</a>
</main>

<style lang="scss">
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 8px;

		margin-top: 24px;
		background-color: white;
		border-radius: 4px;
		> p {
			font-size: 32px;
		}
		> a {
			font-size: 24px;
			color: var(--primary-hover);
			font-weight: 600;
		}
	}
</style>
