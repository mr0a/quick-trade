<script>
	import Account from '../components/Account.svelte';
	import OptionSelector from '../components/OptionSelector.svelte';
	import PutOption from '../components/PutOption.svelte';
	import CallOption from '../components/CallOption.svelte';
	import InstrumentStatus from '../components/InstrumentStatus.svelte';
	import QuickButton from '../components/QuickButton.svelte';
	import Tabs from '../components/Tabs.svelte';
	import Positions from '../components/Positions.svelte';
	import OrderBook from '../components/OrderBook.svelte';
	import Journal from '../components/Journal.svelte';
	import OptionChain from '../components/OptionChain.svelte';
	import { placeOrder } from '../helper/flattrade';
	import { callOption, putOption } from '../stores/readableStores';

	let key_bind = true;

	let items = [
		{ label: 'Positions', value: 1, component: Positions },
		{ label: 'Orderbook', value: 2, component: OrderBook },
		{ label: 'Journal', value: 3, component: Journal },
		{ label: 'Option Chain', value: 4, component: OptionChain }
	];

	const handleTrade = async (instrument, trantype) => {
        let {response, jsonData} = await placeOrder(instrument, trantype);
    }

	function on_key_up(event) {
		if (!key_bind) return;
		switch (event.key) {
			case 'ArrowUp':
				event.preventDefault();
				console.debug('Up Arrow Pressed --> Call Buy');
				handleTrade($callOption, "B")
				break;

			case 'ArrowLeft':
				event.preventDefault();
				console.debug('Left Arrow Pressed --> Call Sell');
				handleTrade($callOption, "S")
				break;

			case 'ArrowDown':
				event.preventDefault();
				console.debug('Down Arrow Pressed --> Put Buy');
				handleTrade($putOption, "B")
				break;

			case 'ArrowRight':
				event.preventDefault();
				console.debug('Right Arrow Pressed --> Put Sell');
				handleTrade($putOption, "S")
				break;
		}
	}
	
</script>

<svelte:head>
	<title>Trading Dashboard</title>
	<meta name="description" content="This is a trading terminal to take trade quick" />
</svelte:head>

<svelte:window on:keyup={on_key_up} />

<div class="mb-5">
	<!-- <Modal /> -->
	<Account />
	<OptionSelector bind:oneClickBuy={key_bind} />

	<div class="flex justify-between m-5">
		<CallOption />
		<div>
			<InstrumentStatus />
			<QuickButton />
		</div>
		<PutOption />
	</div>
	<Tabs {items} />
</div>
