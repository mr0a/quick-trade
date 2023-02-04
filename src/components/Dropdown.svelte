<script>
	export let menus;
	export let value;
</script>

<div class="relative inline-block text-center">
	<select
		type="button"
		class="w-56 rounded-md border border-gray-300 bg-white px-4 py-2 text-medium font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-gray-100"
		aria-expanded="true"
		aria-haspopup="true"
		bind:value={value}
	>
		<!-- <Icon class="-mr-1 ml-2 h-5 w-5" src={ChevronDown} size="16" />     -->
		{#each menus as menu}
			<option>{menu}</option>
		{:else}
			<option disabled>No Option</option>
		{/each}
	</select>
</div>
