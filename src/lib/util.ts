/** Returns array of integers in range. Includes `from`, but not `to` values. */
export function range(from: number, to: number) {
	return Array.from(new Array(to - from), (_, i) => i + from);
}

/**
 * Returns name of the month.
 *
 * @param month Month index from 0 to 11.
 * */
export function monthToName(month: number) {
	return [
		"Январь",
		"Февраль",
		"Март",
		"Апрель",
		"Май",
		"Июнь",
		"Июль",
		"Август",
		"Сентябрь",
		"Октябрь",
		"Ноябрь",
		"Декабрь"
	][(month - 1) % 12];
}
