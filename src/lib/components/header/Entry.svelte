<script lang="ts">
	export let href: string;
	export let icon: string;
	export let name: string;
</script>

<a {href}>
	<img src={icon} alt="" />
	<span>{name}</span>
</a>

<style lang="scss">
	a {
		flex: 0 1 41px;
		display: flex;
		gap: 10px;
		padding: 10px 24px;
		align-items: center;
		background-color: var(--primary-bg);
		text-decoration: none;
		img {
			height: 31px;
			width: 31px;
			-webkit-user-drag: none;
			object-fit: none;
		}
		span {
			font-size: 20px;
			font-family: "AlegreyaSans";
			color: var(--text);
		}
		&:hover {
			background-color: var(--primary-bg-hover);
		}
	}
</style>
