<script>
	import { onMount } from 'svelte';
	import { realtimeData, optionStore } from '../stores/writableStores';
	import { indexDataStore } from '../stores/readableStores';


	let ltp, percent = 0;

	$: ltp = $realtimeData[$indexDataStore.token]?.lp
	$: percent = $realtimeData[$indexDataStore.token]?.pc

	onMount(() => {
		optionStore.set("NIFTY");
	})
</script>

<div>
	<div>
		<p class="font-bold text-xl font-serif text-center mb-2">{$indexDataStore.name}</p>
		<p class="text-center">
            LTP: 
			<span class="font-medium">{ltp || 0} </span>
			<span class={percent > 0 ? "text-green-700":"text-red-500"}>({percent || 0}%)</span>
        </p>
	</div>
</div>
