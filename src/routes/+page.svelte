<svelte:head>
  <title>Trading Dashboard</title>
</svelte:head>

<script>
  import Account from "../components/Account.svelte";
  import OptionSelector from "../components/OptionSelector.svelte";
  import PutOption from "../components/PutOption.svelte";
  import CallOption from "../components/CallOption.svelte";
  import Instrument from "../components/Instrument.svelte";
  import QuickButton from "../components/QuickButton.svelte";
  import Tabs from "../components/Tabs.svelte";
  import Positions from "../components/Positions.svelte";
  import OrderBook from "../components/OrderBook.svelte";
  import Journal from "../components/Journal.svelte";

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
		}
  ];
</script>

<div>
  <Account />
  <OptionSelector />
  <div class="flex justify-between m-10">
    <CallOption />
    <div>
      <Instrument />
      <QuickButton />
    </div>
    <PutOption />
  </div>
  <Tabs {items} />
</div>