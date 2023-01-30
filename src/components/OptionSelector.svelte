<script>
	import Dropdown from './Dropdown.svelte';
	let option_menu = ['Nifty', 'Nifty Bank', 'Finnifty'];
	let expiry_menu = [
		'02-Feb-2023',
		'09-Feb-2023',
		'16-Feb-2023',
		'23-Feb-2023',
		'02-Mar-2023',
		'29-Mar-2023',
		'27-Apr-2023',
		'29-Jun-2023',
		'28-Sep-2023',
		'28-Dec-2023'
	];
	let strike_menu = [
		'16,500.00',
		'16,550.00',
		'16,600.00',
		'16,650.00',
		'16,700.00',
		'16,750.00',
		'16,800.00',
		'16,850.00',
		'16,900.00',
		'16,950.00',
		'17,000.00',
		'17,050.00',
		'17,100.00',
		'17,150.00',
		'17,200.00',
		'17,250.00',
		'17,300.00',
		'17,350.00',
		'17,400.00',
		'17,450.00',
		'17,500.00',
		'17,550.00',
		'17,600.00',
		'17,650.00',
		'17,700.00',
		'17,750.00',
		'17,800.00',
		'17,850.00',
		'17,900.00',
		'17,950.00',
		'18,000.00',
		'18,050.00',
		'18,100.00',
		'18,150.00',
		'18,200.00',
		'18,250.00',
		'18,300.00',
		'18,350.00',
		'18,400.00',
		'18,450.00',
		'18,500.00',
		'18,550.00',
		'18,600.00',
		'18,650.00',
		'18,700.00',
		'18,750.00',
		'18,800.00',
		'18,850.00',
		'18,900.00',
		'18,950.00',
		'19,000.00'
	];
    let qty_menu = [1,2,3,4,5,6,7,8,9,10]
</script>

<div class="flex justify-around mt-5">
	<div class="flex flex-col">
		<label
			class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
			for="option_selector">Option</label
		>
		<!-- <input type="text" name="option_selector"> -->
		<Dropdown menus={option_menu} />
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
		<Dropdown menus={strike_menu} />
	</div>
	<div class="flex flex-col">
		<label
			class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
			for="option_selector">Put Strike Price</label
		>
		<Dropdown menus={strike_menu} />
	</div>
	<div class="flex flex-col">
		<label
			class="block mb-2 text-medium font-medium text-gray-900 dark:text-white"
			for="option_selector">Quantity (lots)</label
		>
		<Dropdown menus={qty_menu} />
	</div>
</div>
