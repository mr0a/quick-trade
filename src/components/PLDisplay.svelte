<script>
	import { Icon, LockClosed } from 'svelte-hero-icons';
	import { plLimitStore } from '../stores/writableStores';
	import Modal from './Modal.svelte';

	export let net_quantity = 0;
	export let mtm = 0;

	export let tax = 0;
	export let rpnl = 0;
	export let premium = 0;

	let { max_profit = 0, max_loss = 0 } = $plLimitStore;

	let showModal = false;

	const handleModalClose = () => {
		showModal = !showModal;
	};

	// const handlePLSubmit = () => {
	//     plLimitStore.set({max_profit, max_loss})
	//     handleModalClose();
	// }
</script>

<div>
	{#if showModal}
		<Modal on:close={() => (showModal = false)}>
			<h2 slot="header">
				<p>Set Profit and Loss Limit</p>
			</h2>
			<div>
				<div class="grid grid-cols-2 gap-3">
					<!-- <div class="inline-flex gap-2"> -->
					<p>Stop Loss</p>
					<input
						type="number"
						class="border rounded text-center w-32"
						bind:value={$plLimitStore.max_loss}
					/>
					<!-- </div> -->
					<!-- <div class="inline-flex gap-2"> -->
					<p>Profit</p>
					<input
						type="number"
						class="border rounded text-center w-32"
						bind:value={$plLimitStore.max_profit}
					/>

					<p>Show Warning</p>
					<input type="checkbox" name="warning" bind:checked={$plLimitStore.warning} />

					<p>Close Open Positions</p>
					<input type="checkbox" name="closePosition" bind:checked={$plLimitStore.close_position} />
					<!-- </div> -->
				</div>
				<!-- <button class="border rounded mt-5 px-2 bg-sky-500" on:click={handlePLSubmit}>Submit</button> -->
			</div>
		</Modal>
	{/if}
	<div class="flex justify-around border-b-2 pb-2">
		<p>Net Qty: {net_quantity}</p>
		<p>MTM: {mtm}</p>
		<p class="inline-flex items-center gap-2">
			P&L:
			<span class={(parseFloat(rpnl) + parseFloat(premium)) > 0 ? 'text-red-500' : 'text-green-500'}>
				{-1*(parseFloat(rpnl) + parseFloat(premium))} ({((-1*(parseFloat(rpnl) + parseFloat(premium))) / mtm) * 100}%)
			</span>
			<a href="#id" on:click={handleModalClose} class="text-red-500"
				><Icon src={LockClosed} size="20" /></a
			>
		</p>
		<p>Tax: <span>{tax}</span></p>
	</div>
</div>
