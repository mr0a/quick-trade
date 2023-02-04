<script>
	import Dropdown from './Dropdown.svelte';
	import { callStrikeStore, putStrikeStore, expiryStore, quantityStore, optionStore } from '../stores/writableStores';
	import { indexDataStore } from '../stores/readableStores';
	import { INDICES, EXPIRY_DATES, QUANTITY } from '../constants';
	import { getOptionStrikes } from '../helper/helper';
	import { onMount } from 'svelte';

	export let oneClickBuy;


	let strikeOptions = ["17500", "17600"]

	onMount(() => {
		indexDataStore.subscribe(index => {
			if (index.name != ""){
				getOptionStrikes(index.name).then(data => {
					strikeOptions = data
				})
			}
		})
	})


</script>

<div>
	<div class="flex justify-around mt-3">
		<div class="flex flex-col">
			<label
				class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
				for="option_selector">Option</label
			>
			<Dropdown menus={INDICES} bind:value={$optionStore} />
		</div>
		<div class="flex flex-col">
			<label
				class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
				for="option_selector">Expiry Date</label
			>
			<Dropdown menus={EXPIRY_DATES} bind:value={$expiryStore} />
		</div>
		<div class="flex flex-col">
			<label
				class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
				for="option_selector">Call Strike Price</label
			>
			<Dropdown menus={strikeOptions} bind:value={$callStrikeStore} />
		</div>
		<div class="flex flex-col">
			<label
				class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
				for="option_selector">Put Strike Price</label
			>
			<Dropdown menus={strikeOptions} bind:value={$putStrikeStore} />
		</div>
		<div class="flex flex-col">
			<label
				class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
				for="option_selector">Quantity (lots)</label
			>
			<Dropdown menus={QUANTITY} bind:value={$quantityStore} />
		</div>
	</div>
	<div class="flex gap-2 justify-end mt-3">
		<input type="checkbox" name="one_click" bind:checked={oneClickBuy}>
		<label for="one_click">Quick Trade</label>
	</div>
</div>
