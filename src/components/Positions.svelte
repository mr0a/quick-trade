<script>
	import { Icon, PlusCircle, XCircle } from 'svelte-hero-icons';
	import { onMount } from 'svelte';
	import { getDataFromBroker, placeOrder } from '../helper/flattrade';
	import { addToWatchlist } from '../helper/helper';
	import PlDisplay from './PLDisplay.svelte';
	import StopLoss from './StopLoss.svelte';
	import { marginStore, brokerStore, positionStore, subscribeList, stopLossStore, realtimeData } from '../stores/writableStores';

	let positions = $positionStore;
	$: positions = $positionStore
	let mtm,
		rpnl,
		net_quantity,
		brokerage = 0;

	$: mtm = $marginStore?.cash;
	$: ({ rpnl = 0, brokerage = 0, premium = 0 } = $marginStore);

	const handleClose = (index) => {
		console.log('Clicked', index);
		// placeOrder()
		positions[index].isOpen = false;
	};

	$: positions.forEach( (pos, index) => {
		let props = $realtimeData[pos.token]
		let ltp = 0;
		if (props != "undefined"){
			ltp = parseFloat(props?.lp) || 0
			positions[index].ltp = parseFloat(ltp);
		}
		// if(pos.isOpen){
		// 	if(parseFloat(pos.ltp) != 0 && parseFloat(pos.stop_loss) >= parseFloat(pos.ltp)){
		// 		// console.log(`Close Position as sl is at ${pos.stop_loss} and ltp is at ${pos.ltp}`)
		// 	}
		// }
	})

	// $: console.log($stopLossStore)

	// const updateMargin = () => {
	// 	getDataFromBroker('/Limits', {
	// 		actid: $brokerStore.client_id
	// 	}).then(({ response, jsonData }) => {
	// 		console.debug(response);
	// 		if (response.status == 200) {
	// 			marginStore.set(jsonData);
	// 		}
	// 	});
	// };

	onMount(() => {
		// updateMargin();
		// updatePositions();
	});

	let keyAction = {};

	const handleKeyEvent = (event) => {
		keyAction['+'] = event.detail.execute_inc
		keyAction['-'] = event.detail.execute_dec
	}

	const handleKeyPress = (event) => {
		let action = keyAction[event.key]
		if(action){
			action();
		}
	}

	const handleAddStopLoss = (token_symbol, token) => {
		console.log("Added stoploss for ", token_symbol)
		stopLossStore.update(stoploss => {
			stoploss[token_symbol] = $realtimeData[token]?.lp - 20 || 0;
			return stoploss;
		})
	}
</script>

<svelte:window on:keypress={handleKeyPress}/>

<div>
	<PlDisplay tax={brokerage} {mtm} {net_quantity} {rpnl} {premium} />

	<div>
		<div class="overflow-x-auto p-3">
			<table class="table-auto w-full">
				<thead class="text-xs font-semibold uppercase text-black bg-gray-50">
					<tr>
						<!-- <th class="p-2" /> -->
						<th class="p-2">
							<div class="font-semibold text-left">Symbol Name</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">Quantity</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">Type</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">LTP</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">SL</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">Break Even</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">Risk</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">P&L</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-center">Action</div>
						</th>
						<!-- <th class="p-2">
                            <div class="font-semibold text-left">Avg Price</div>
                        </th> -->
						<th class="p-2">
							<div class="font-semibold text-left">Buy Qty</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">Buy Price</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">Sell Price</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">Sell Qty</div>
						</th>
					</tr>
				</thead>

				<tbody class="text-sm divide-y divide-gray-100">
					{#each positions as position, index}
						<tr class="h-14">
							<td class="p-2">
								<div class=" text-gray-800">{position.name}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{position.net_qty}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{position.type}</div>
							</td>
							<td class="p-2 w-20">
								<div class="text-left {parseFloat(position.ltp) > parseFloat(position.sell_price) ? "font-bold": ""}">
									{position.ltp}
								</div>
							</td>
							<td class="p-2">
								<div class="text-left">
									{#if position.isOpen}
										{#if $stopLossStore[position.token_symbol] != undefined}
											<StopLoss 
											transType = {position.type}
											instrument={position.token_symbol}
											quantity={position.net_qty}
											on:press={handleKeyEvent} 
											/>
										{:else}
										<button on:click={() => handleAddStopLoss(position.token_symbol, position.token)}>
											<Icon src={PlusCircle} size=16 on:click={() => handleAddStopLoss(position.token_symbol, position.token)} />
										</button>
										{/if}
									{:else}
										<span>-</span>
									{/if}
								</div>
							</td>
							<td class="p-2">
								<div class="text-left">
									{position.isOpen ? position.bep: "-"}
								</div>
							</td>
							<td class="p-2">
								<div class="text-left">
									{position.isOpen ? Math.round((position.net_qty * (position.net_avgprc - ($stopLossStore[position.token_symbol] || 0))),) : 0}
								</div>
							</td>
							<td class="p-2">
								<div class="text-left {position.pnl > 0 ? 'text-green-500' : 'text-red-500'}">
									{Math.round(position.pnl + (position.net_qty * (position.ltp - position.net_avgprc)), 4)}
								</div>
							</td>
							<td class="p-2">
								{#if position.isOpen}
									<div class="flex justify-center">
										<button
											on:click={() => handleClose(index)}
											aria-label="Close Position of {position.name}"
										>
											<Icon
												src={XCircle}
												size="32"
												class="w-8 h-8 hover:text-blue-600 rounded-full hover:bg-gray-100 p-1"
											/>
										</button>
									</div>
								{:else}
									<div class="text-center font-medium">-</div>
								{/if}
							</td>
							<td class="p-2">
								<div class="text-left">{position.buy_qty}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{position.buy_price}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{position.sell_price}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{position.sell_qty}</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
