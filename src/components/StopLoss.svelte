<script>
	import { createEventDispatcher, onDestroy } from 'svelte';
	import { placeOrder } from '../helper/flattrade';
	import { exchangeProperties, positionStore, realtimeData, stopLossStore } from '../stores/writableStores';

	const dispatch = createEventDispatcher();

	export let instrument;
	export let transType;
	export let quantity;

	let stoplossValue = 0;
	
	$: stoplossValue = $stopLossStore[instrument]
	
	let realtimeDataUnsubscribe = realtimeData.subscribe(newData => {
		let token = $exchangeProperties[instrument]?.token;
		let data = newData[token];
		// console.log(newData)
		if(data == "undefined"){
			console.log("Error in getting new data for stoploss");
			return;
		}
		let ltp = parseFloat(data?.lp);
		if(transType === "B"){
			if(stoplossValue != 0 && ltp <= stoplossValue){
				quantity = parseInt(quantity / parseInt($exchangeProperties[instrument].ls));
				placeOrder(instrument, "S", quantity)
				positionStore.refresh();
				stopLossStore.update(obj => {
					delete obj[instrument];
					return obj;
				})
			}
		} else if(stoplossValue != 0 && transType === "S"){
			if(ltp >= stoplossValue){
				quantity = parseInt(quantity / parseInt($exchangeProperties[instrument].ls));
				placeOrder(instrument, "B", quantity)
				positionStore.refresh();
				stopLossStore.update(obj => {
					delete obj[instrument];
					return obj;
				})
			}
		}
	})

    const dispatchEvent = () => {
        dispatch('press', {
			execute_inc: increment,
            execute_dec: decrement
		});
    }

	const increment = () => {
		dispatchEvent()
		++$stopLossStore[instrument];
	};

	const decrement = () => {
		dispatchEvent()
		stoplossValue > 0 && --$stopLossStore[instrument];
	};

	onDestroy(() => {
		realtimeDataUnsubscribe();
	})
</script>

<div class="custom-number-input h-10 w-32">
	<div class="flex flex-row h-10 w-full rounded-lg relative bg-transparent mt-1">
		<button
			data-action="decrement"
			class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none"
			on:click={decrement}
		>
			<span class="m-auto text-2xl font-thin">−</span>
		</button>
		<input
			type="number"
			class="outline-none focus:outline-none text-center w-full bg-gray-300 font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700  outline-none"
			name="custom-input-number"
			bind:value={$stopLossStore[instrument]}
		/>
		<button
			data-action="increment"
			class="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer"
			on:click={increment}
		>
			<span class="m-auto text-2xl font-thin">+</span>
		</button>
	</div>
</div>

<style>
	input[type='number']::-webkit-inner-spin-button,
	input[type='number']::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.custom-number-input input:focus {
		outline: none !important;
	}

	.custom-number-input button:focus {
		outline: none !important;
	}
</style>
