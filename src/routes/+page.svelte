<svelte:head>
  <title>Trading Dashboard</title>
  <meta name="description" content="This is a trading terminal to take trade quick">
</svelte:head>

<script>
  import Account from "../components/Account.svelte";
  import OptionSelector from "../components/OptionSelector.svelte";
  import PutOption from "../components/PutOption.svelte";
  import CallOption from "../components/CallOption.svelte";
  import InstrumentStatus from "../components/InstrumentStatus.svelte";
  import QuickButton from "../components/QuickButton.svelte";
  import Tabs from "../components/Tabs.svelte";
  import Positions from "../components/Positions.svelte";
  import OrderBook from "../components/OrderBook.svelte";
  import Journal from "../components/Journal.svelte";
	import OptionChain from "../components/OptionChain.svelte";

  let items = [
    { label: "Positions",
		 value: 1,
		 component: Positions
		},
    { label: "Orderbook",
		 value: 2,
		 component: OrderBook
		},
    { label: "Journal",
		 value: 3,
		 component: Journal
		},
    { label: "Option Chain",
      value: 4,
      component: OptionChain
    }
  ];
</script>

<div class="mb-5">
  <Account />
  <OptionSelector />
  <div class="flex justify-between m-10">
    <CallOption />
    <div>
      <InstrumentStatus />
      <QuickButton />
    </div>
    <PutOption />
  </div>
  <Tabs {items} />
</div>