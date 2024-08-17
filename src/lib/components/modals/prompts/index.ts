import type { SvelteComponent } from "svelte";
import { openModal } from "svelte-modals";

import Prompt from "./Prompt.svelte";
import TextPrompt from "./TextPrompt.svelte";
export { Prompt, TextPrompt };

export default function createPrompt<T, Props extends Record<string, any>>(
	component: PromptModalComponent<Props & { promptCallback: Resolve<T> }>,
	props: Omit<Props, "isOpen" | "promptCallback">
) {
	let promiseResolve: Resolve<T>;
	let promise = new Promise<T>(resolve => {
		promiseResolve = resolve;
		openModal(component, {
			...props,
			promptCallback: promiseResolve
		} as any);
	});

	return promise;
}

export type PromptModalComponent<
	Props extends Record<string, any> = any,
	Events extends Record<string, any> = any,
	Slots extends Record<string, any> = any
> = new (...args: any) => SvelteComponent<Props, Events, Slots>;

export type Resolve<T> = (value: T | PromiseLike<T>) => void;
