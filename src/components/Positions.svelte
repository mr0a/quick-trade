<script>
	import { Icon, XCircle } from 'svelte-hero-icons';
	import { marginStore, brokerStore } from '../stores/broker_details';
	import { onMount } from 'svelte';

	let net_qty = 0;

	let positions = [];

	const handleClose = (index) => {
		console.log('Clicked', index);
		positions[index].isOpen = false;
		console.log(positions);
	};

	const updateMargin = () => {
		let data = {
			uid: $brokerStore.client_id,
			actid: $brokerStore.client_id
		};
		let response = fetch('https://piconnect.flattrade.in/PiConnectTP/Limits', {
			mode: 'cors',
			method: 'POST',
			body: 'jData=' + JSON.stringify(data) + '&jKey=' + $brokerStore.token
		});
		response.then((resp) => {
			console.log(resp);
			if (resp.status == 200) {
				resp.json().then((data) => marginStore.set(data));
			}
		});
		console.log($marginStore);
	};

	const updatePositions = async () => {
		let data = {
			uid: $brokerStore.client_id,
			actid: $brokerStore.client_id
		};
		let response = fetch('https://piconnect.flattrade.in/PiConnectTP/PositionBook', {
			mode: 'cors',
			method: 'POST',
			body: 'jData=' + JSON.stringify(data) + '&jKey=' + $brokerStore.token
		});
		response.then((resp) => {
			if (resp.status == 200) {
				resp.json().then((data) => {
					console.log(data);
					positions = data.map((pos) => {
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
					console.log(positions);
				});
			}
		});
	};

	onMount(() => {
		updateMargin();
		updatePositions();
	});
</script>

<div>
	<div class="flex justify-around border-b-2 pb-2">
		<p>Net Qty: {net_qty}</p>
		<p>MTM: {$marginStore.cash}</p>
		<p>
			P&L: <span class="{$marginStore.rpnl > 0 ? "text-green-500": "text-red-500"}">{$marginStore.rpnl}</span>
		</p>
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
								<div class="text-left {position.pl > 0 ? "text-green-500": "text-red-500"}">
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
