<script lang="ts">
	export let minWidth: number | null = null;

	export let columns: ColumnSizing[];
	$: gridTemplateColumns = columns.map(mapColumnSize).join(" ");
	type ColumnSizing = Size | [Px, Size];
	type Size = `${number}px` | `${number}fr`;
	type Px = `${number}px`;
	type ResultingSize = `minmax(${Px}, ${Size})` | Size;

	function mapColumnSize(s: ColumnSizing): ResultingSize {
		if (Array.isArray(s)) {
			return `minmax(${floor(s[0])}, ${s[1]})`;
		} else if (minWidth !== null) {
			return `minmax(${minWidth}px, ${s})`;
		} else {
			return s;
		}
	}

	function floor(s: Px): Px {
		if (minWidth === null) return s;
		if (s.endsWith("fr")) return s;
		let n = Number(s.replace("px", ""));
		if (n < minWidth) return `${minWidth}px`;
		return s;
	}
</script>

<div class="datagrid" style:grid-template-columns={gridTemplateColumns}>
	<header>
		<slot name="header" />
	</header>
	<div class="body">
		<slot name="rows" />
	</div>
	<footer>
		<slot name="footer" />
	</footer>
</div>

<style lang="scss">
	.datagrid {
		flex: 1;
		overflow: auto hidden;
		border-radius: 4px;

		display: grid;
		grid-template-rows: min-content 1fr min-content;
		grid-template-columns: 1fr;

		> header,
		> .body,
		> footer {
			display: grid;
			grid-template-columns: subgrid;
			grid-auto-rows: min-content;
			grid-column: 1 / -1;
		}

		> header {
			overflow: hidden;
		}
		> .body {
			overflow: scroll;
			border-radius: 0 0 4px 4px;
			background-color: white;
		}
	}
</style>
