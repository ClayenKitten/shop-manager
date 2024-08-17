import { writable } from "svelte/store";

export default function createToastNotification(
	message: string,
	kind: "info" | "success" | "error" = "info",
	timeToLive: number = 5
) {
	const id = nextId++;
	toastState.update(toasts => [...toasts, { id, message, kind, timeToLive }]);
}

export const toastState = writable<Notification[]>([]);
let nextId = 1;

export interface Notification {
	id: number;
	message: string;
	kind: "info" | "success" | "error";
	timeToLive: number;
}
