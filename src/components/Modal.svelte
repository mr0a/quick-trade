<script>
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { Icon, X } from 'svelte-hero-icons';
	import { clickOutside } from '../helper/clickOutside';

	const dispatch = createEventDispatcher();
	const close = () => dispatch('close');

	let modal;

	const handle_keydown = (e) => {
		if (e.key === 'Escape') {
			close();
			return;
		}

		if (e.key === 'Tab') {
			// trap focus
			const nodes = modal.querySelectorAll('*');
			const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0);

			let index = tabbable.indexOf(document.activeElement);
			if (index === -1 && e.shiftKey) index = 0;

			index += tabbable.length + (e.shiftKey ? -1 : 1);
			index %= tabbable.length;

			tabbable[index].focus();
			e.preventDefault();
		}
	};

	const previously_focused = typeof document !== 'undefined' && document.activeElement;

	if (previously_focused) {
		onDestroy(() => {
			previously_focused.focus();
		});
	}
</script>

<svelte:window on:keydown={handle_keydown} />

<div class="modal-background bg-slate-100 opacity-80" />

<div
	class="modal bg-white border rounded-lg p-5"
	role="dialog"
	aria-modal="true"
	bind:this={modal}
	use:clickOutside
	on:click_outside={close}
>
	<div class="flex justify-between mb-2 font-bold">
		<slot name="header" />
		<button on:click={close} class="border rounded p-1 bg-red-600 text-white"
			><Icon src={X} size="16" /></button
		>
	</div>
	<hr />
	<div class="text-center mt-2">
		<slot />
	</div>
	<!-- <hr> -->

	<!-- svelte-ignore a11y-autofocus -->
	<!-- <button autofocus on:click={close}>close modal</button> -->
</div>

<style>
	.modal-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		/* background: rgba(0,0,0,0.3); */
	}

	.modal {
		position: absolute;
		left: 50%;
		top: 50%;
		width: calc(100vw - 4em);
		max-width: 28em;
		max-height: calc(100vh - 4em);
		overflow: auto;
		transform: translate(-50%, -50%);
		/* padding: 1em; */
		/* border-radius: 0.2em; */
		/* background: white; */
	}

	button {
		display: block;
	}
</style>
