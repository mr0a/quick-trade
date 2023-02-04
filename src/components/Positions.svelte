<script>
	import { Icon, XCircle } from 'svelte-hero-icons';
	import { onMount, onDestroy } from 'svelte';
	import { getDataFromBroker } from '../helper/flattrade';
	import { marginStore, brokerStore } from '../stores/writableStores';

	let net_qty = 0;

	let positions = [];

	let mtm = 0, rpnl = 0, brkage_d_b = 0;

	$: mtm = $marginStore?.cash;
	$: ({rpnl = 0, brkage_d_b = 0} = $marginStore);

	const handleClose = (index) => {
		console.log('Clicked', index);
		positions[index].isOpen = false;
	};

	const updateMargin = () => {
		getDataFromBroker('/Limits', {
			actid: $brokerStore.client_id
		}).then(({ response, jsonData }) => {
			console.debug(response);
			if (response.status == 200) {
				marginStore.set(jsonData);
			}
		});
	};

	const updatePositions = async () => {
		let { response, jsonData } = await getDataFromBroker('/PositionBook', {
			actid: $brokerStore.client_id
		});
		if (response.status == 200 && jsonData.stat == "Ok") {
			positions = jsonData.map((pos) => {
				let buy_or_sell = '-';
				if (pos.daybuyqty > pos.daysellqty) {
					buy_or_sell = 'BUY';
				} else if (pos.daybuyqty < pos.daysellqty) {
					buy_or_sell = 'SELL';
				}
				let position = {
					name: pos.dname,
					qty: pos.cfbuyqty,
					ltp: pos.lp,
					pl: pos.rpnl,
					isOpen: parseInt(pos.netqty) != 0,
					type: buy_or_sell,
					buy_qty: pos.daybuyqty,
					sell_qty: pos.daysellqty,
					buy_price: pos.daybuyavgprc,
					sell_price: pos.daysellavgprc,
					exchange: pos.exch,
					token_symbol: pos.tsym,
					token: pos.token
				};
				return position;
			});
		}
	};

	onMount(() => {
		updateMargin();
		updatePositions();
	});
</script>

<div>
	<div class="flex justify-around border-b-2 pb-2">
		<p>Net Qty: {net_qty}</p>
		<p>MTM: {mtm}</p>
		<p>
			P&L: <span class={rpnl > 0 ? 'text-red-500': 'text-green-500'}
				>{rpnl > 0 ? '-': ''}{rpnl}</span
			>
		</p>
		<p>Tax: <span>{brkage_d_b}</span></p>
	</div>

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
								<div class="text-left">{position.qty}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{position.type}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{position.ltp}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{position.sl || '-'}</div>
							</td>
							<td class="p-2">
								<div class="text-left">
									{position.isOpen ? position.buy_price - (position.sl || 0) : 0}
								</div>
							</td>
							<td class="p-2">
								<div class="text-left {position.pl > 0 ? 'text-green-500' : 'text-red-500'}">
									{position.pl}
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
