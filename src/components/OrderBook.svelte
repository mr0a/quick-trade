<script>
	import { getDataFromBroker } from '../helper/flattrade';
	import { Icon, XCircle } from 'svelte-hero-icons';
	import { onMount } from 'svelte';

	let orders = [];

	onMount(() => {
		getDataFromBroker('/OrderBook').then(({ response, jsonData }) => {
			orders = jsonData;
		});
	});

	const handleCancel = (order_no) => {
		console.log('Cancel order', order_no);
	};
</script>

<div>
	<!-- <div class="flex justify-around border-b-2 pb-2">
		<p>Net Qty: {net_qty}</p>
		<p>MTM: {$marginStore.cash}</p>
		<p>
			P&L: <span class={$marginStore.rpnl > 0 ? 'text-green-500' : 'text-red-500'}
				>{$marginStore.rpnl}</span
			>
		</p>
	</div> -->

	<div>
		<div class="overflow-x-auto p-3">
			<table class="table-auto w-full">
				<thead class="text-xs font-semibold uppercase text-black bg-gray-50">
					<tr>
						<th class="p-2">
							<div class="font-semibold text-left">Order Number</div>
						</th>
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
							<div class="font-semibold text-left">Price</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">Stop Loss</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">Price Type</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">Status</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-left">Action</div>
						</th>
						<th class="p-2">
							<div class="font-semibold text-center">Message</div>
						</th>
						<!-- <th class="p-2">
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
						</th> -->
					</tr>
				</thead>

				<tbody class="text-sm divide-y divide-gray-100">
					{#each orders as order, index}
						<tr class="h-14">
							<td class="p-2">
								<div class=" text-gray-800">{order.norenordno}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{order.dname}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{order.qty}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{order.trantype}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{order.prc}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{order?.blprc || '-'}</div>
							</td>
							<td class="p-2">
								<div class="text-left">{order.prctyp}</div>
							</td>
							<td class="p-2">
								<div
									class="text-left {order.status == 'COMPLETE' ? 'text-green-500' : 'text-red-500'}"
								>
									{order.status}
								</div>
							</td>
							<td class="p-2">
								{#if order.status != 'COMPLETE'}
									<div class="flex justify-center">
										<button
											on:click={() => handleCancel(order.norenordno)}
											aria-label="Cancel Order of {order.dname}"
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
								{#if order.rejreason}
									<div class="flex justify-center">
										{order.rejreason}
									</div>
								{:else}
									<div class="text-center font-medium">-</div>
								{/if}
							</td>
							<!-- <td class="p-2">
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
							</td> -->
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
