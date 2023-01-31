<script>
	import Dropdown from './Dropdown.svelte';
	import {option} from '../stores/option_strike'
	import {getStrike, call_strike, put_strike} from '../stores/option_strike'
	import {OPTIONS, EXPIRY_DATES, QUANTITY} from '../constants'

	let expiry_menu = EXPIRY_DATES.filter((date) => {
		let today = new Date();
		return !(new Date(date) < today)
	})

	const optionSelectHandler = (value) => option.set(value)
	const callStrikeSelectHandler = (value) => call_strike.set(value)
	const putStrikeSelectHandler = (value) => put_strike.set(value)

	let strikeOptionStore = getStrike()

	$:console.log("strike", $strikeOptionStore, $call_strike, $put_strike)

</script>

<div class="flex justify-around mt-5">
	<div class="flex flex-col">
		<label
			class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
			for="option_selector">Option</label
		>
		<!-- <input type="text" name="option_selector"> -->
		<Dropdown menus={OPTIONS} handler={optionSelectHandler} value={$option} />
	</div>
	<div class="flex flex-col">
		<label
			class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
			for="option_selector">Expiry Date</label
		>
		<Dropdown menus={expiry_menu} />
	</div>
	<div class="flex flex-col">
		<label
			class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
			for="option_selector">Call Strike Price</label
		>
		<Dropdown menus={$strikeOptionStore} handler={callStrikeSelectHandler} value={$call_strike} />
	</div>
	<div class="flex flex-col">
		<label
			class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
			for="option_selector">Put Strike Price</label
		>
		<Dropdown menus={$strikeOptionStore} handler={putStrikeSelectHandler} value={$put_strike} />
	</div>
	<div class="flex flex-col">
		<label
			class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
			for="option_selector">Quantity (lots)</label
		>
		<Dropdown menus={QUANTITY} />
	</div>
</div>
