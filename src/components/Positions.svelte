<script>
	import { Icon, XCircle } from 'svelte-hero-icons';

	let net_qty = 0;
	let mtm = 123654;

	let positions = [
		{
			name: 'Bank Nifty 42200 CE 2nd Feb',
			qty: 150,
			ltp: 96,
			pl: 145,
			isOpen: false,
            type: 'BUY',
			// avg_price: 74,
			buy_qty: 150,
			sell_qty: 150,
			buy_price: 74,
			sell_price: 88
		},
		{
			name: 'Bank Nifty 42200 CE 2nd Feb',
			qty: 150,
			ltp: 96,
			pl: 145,
			isOpen: false,
            type: 'SELL',
			// avg_price: 74,
			buy_qty: 150,
			sell_qty: 150,
			buy_price: 74,
			sell_price: 88
		}
	];
</script>

<div>
	<div class="flex justify-around border-b-2 pb-2">
		<p>Net Qty: {net_qty}</p>
		<p>MTM: {mtm}</p>
	</div>

	<div>
		<div class="overflow-x-auto p-3">
			<table class="table-auto w-full">
				<thead class="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
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
                    {#each positions as position}
					<tr>
						<td class="p-2">
							<div class="font-medium text-gray-800">{position.name}</div>
						</td>
						<td class="p-2">
							<div class="text-left">{position.qty}</div>
						</td>
                        <td class="p-2">
							<div class="text-left">{position.type}</div>
						</td>
						<td class="p-2">
							<div class="text-left font-medium">{position.ltp}</div>
						</td>
                        <td class="p-2">
							<div class="text-left font-medium">{position.sl || '-'}</div>
						</td>
                        <td class="p-2">
							<div class="text-left font-medium">{position.isOpen ? position.buy_price - (position.sl || 0): 0 }</div>
						</td>
                        <td class="p-2">
							<div class="text-left font-medium">{position.pl}</div>
						</td>
						<td class="p-2">
							<div class="flex justify-center">
								<button>
									<Icon
										src={XCircle}
										size="32"
										class="w-8 h-8 hover:text-blue-600 rounded-full hover:bg-gray-100 p-1"
									/>
								</button>
							</div>
						</td>
                        <td class="p-2">
							<div class="text-left font-medium">{position.buy_qty}</div>
						</td>
                        <td class="p-2">
							<div class="text-left font-medium">{position.buy_price}</div>
						</td>
                        <td class="p-2">
							<div class="text-left font-medium">{position.sell_price}</div>
						</td>
                        <td class="p-2">
							<div class="text-left font-medium">{position.sell_qty}</div>
						</td>
					</tr>
                    {/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
