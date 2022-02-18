@psychedelic/sonic-js / [Exports](modules.md)

<h1 align="center">Sonic-js</h1>

<h3 align="center">The client library for Sonic</h3>

> A client library for the [Sonic](https://sonic.ooo/) Open Internet Service (OIS), implemented in JavaScript.

The Sonic-js library is utilized to integrate UIs/FEs/Apps to Swap Canister to **transact** on Sonic.

- Visit [our website](https://sonic.ooo/)
- Read [Sonics's documentation](https://docs.sonic.ooo/)
- Read [our blog](https://sonic-ooo.medium.com/)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Install](#install)
  - [BigNumber](#bignumber)
- [Usage](#usage)
  - [Integration](#integration)
    - [Agent and Actor](#agent-and-actor)
      - [Actor Adapter](#actor-adapter)
      - [Actor Factories](#actor-factories)
      - [IDLs](#idls)
    - [Swap Canister Controller](#swap-canister-controller)
      - [Class Functions](#class-functions)
  - [Math](#math)
  - [Utils](#utils)
  - [Declarations](#declarations)
    - [Types](#types)
    - [Token](#token)
    - [Pair](#pair)
    - [Default](#default)

## Getting Started

### Install

```bash
yarn add @psychedelic/sonic-js
```

### BigNumber

This library relies on [BigNumber.js](https://www.npmjs.com/package/big-number) to handle numbers and calculations. It is used because its ease of use and to avoid JavaScript limitations when dealing with really big numbers or with a lot of decimal places.

To better deal and present inside your application you can use the cast functions like `toString` and `toNumber`.

Some functions were added to `BigNumber` class prototype because of the high number of utilization inside other of the functions inside the library:

```ts
toBigInt(): bigint;
```

Returns a bigint from a BigNumber

```ts
applyDecimals(decimals: number): BigNumber;
```

Returns a bigint from a BigNumber

```ts
removeDecimals(decimals: number): BigNumber;
```

Removes decimals from a number

```ts
applyTolerance(percentage: number, type?: 'min' | 'max'): BigNumber;
```

Returns the number for a given maximal/minimal tolerance

## Usage

This library holds a set of functions and interfaces that helps in the development of applications that interacts with Sonic canisters.

The library is separated in modules to organize and have ease in use:

### Integration

On integration module is provided functions that helps to interact with IC world.

#### Agent and Actor

First of all to talk with IC we need to create `actors` that communicate with canisters. But to create the `actors` we need to first setup an `agent` that indicates who and how the communication is going to be realized. This library provides some functions that helps in this process to reach the communication with Swap Canister and DIP20 token canisters.

##### Actor Adapter

The class `ActorAdapter` provides an abstraction of [@dfinity/agent](https://www.npmjs.com/package/@dfinity/agent) that helps to instantiate new actors and reuse them.

The class constructor has params that turn able to configure how you want to use the adapter:

- `provider`: This param receives an object that is used to create `agent` and `actors`. The object needs to follow the interface `ActorAdapter.Provider`. Is high recommended if you want to instantiate actors linked with wallets to use [@psychedelic/plug-inpage-provider](https://github.com/Psychedelic/plug-inpage-provider/packages/884575):

```ts
const adapter = new ActorAdapter(window.plug);
```

- `options`: This param is used for selecting some settings of network host and whitelisting canister ids. It follows the interface `ActorAdapter.Options`:

```ts
const adapter = new ActorAdapter(window.plug, {
  host: 'https://boundary.ic0.app/',
  whitelist: ['3xwpq-ziaaa-aaaah-qcn4a-cai'],
});
```

You can also use default parameters and no provider:

```ts
const adapter = new ActorAdapter();
```

##### Actor Factories

To make ease on use for actors, the library provides two functions that directly create actors for Swap and DIP20 canisters:

```ts
createSwapActor(options?: CreateSwapActorOptions): Promise<SwapActor>
```

This one can be called without options and a actor is going to be created using default options.

```ts
createTokenActor(options: CreateTokenActorOptions): Promise<TokenActor>
```

This one has the canister id required to be created.

Both functions can receive an `ActorAdapter` or they are going to use the default one.

##### IDLs

All actors that communicate with IC needs to have an IDL to indicate which functions are callable on the canister. The library already provide this IDLs for Swap and DIP20 canisters and they can be found [here](src/declarations/did).

#### Swap Canister Controller

The class `SwapCanisterController` provides functions that abstracts the main functionalities of Swap Canister. Instantiating it requires a Swap Actor mentioned above.

```ts
const swapActor = await createSwapActor();
const swapCanisterController = new SwapCanisterController(swapActor);
```

Some of the functions will keep the responses stored on class variables to optimize subsequent requests. The variables are:

```ts
tokenList: Token.MetadataList;
pairList: Pair.List;
balanceList: Token.BalanceList;
```

##### Class Functions

```ts
getTokenList(): Promise<Token.MetadataList>
```

Get the list of supported tokens from swap canister

```ts
getPairList(): Promise<Pair.List>
```

Get the list of pairs present in swap canister

```ts
getTokenBalances(principalId: string): Promise<Token.BalanceList>
```

Get the balance of all supported tokens for a given principal id

This function get balances from token and swap canisters

```ts
getTokenBalance(params: SwapCanisterController.GetTokenBalanceParams): Promise<Token.Balance>
```

Get one token balance for a given principal id

```ts
getAgentPrincipal(): Promise<Principal>
```

Get the principal of the agent

```ts
approve(params: SwapCanisterController.ApproveParams): Promise<void>
```

Approve transfers from token to swap canister

This function uses the actor agent identity

```ts
deposit(params: SwapCanisterController.DepositParams): Promise<void>
```

Approve transfers from token to swap canister

```ts
withdraw(params: SwapCanisterController.WithdrawParams): Promise<void>
```

Approve transfers from token to swap canister

```ts
swap(params: SwapCanisterController.SwapParams): Promise<void>
```

Swaps an amount of tokenIn for tokenOut allowing given slippage

### Math

The Math module holds the functions used in calculations to get correct values to be displayed or sent in requests.

```ts
Swap.getAmount(params: Swap.GetAmountOutParams): BigNumber
```

Calculate the needed or resultant amount of a swap

```ts
Swap.getPriceImpact(params: Swap.GetPriceImpactParams): BigNumber
```

Calculate the price impact based on given amounts and prices

```ts
Swap.getTokenPaths(params: Swap.GetTokenPathsParams): Swap.GetTokenPathsResult
```

Calculate the best token path to realize the swap and the output amount

```ts
Liquidity.getPairDecimals(token0Decimals: Types.Decimals, token1Decimals: Types.Decimals): Types.Decimals
```

Calculate the pair decimals for given tokens decimals

```ts
Liquidity.getPosition(params: Liquidity.GetPositionParams): BigNumber
```

Calculate the Liquidity Position for given amounts of a pair of tokens that's going to be added

```ts
Liquidity.getShareOfPool(params: Liquidity.GetShareOfPoolParams): BigNumber
```

Calculate Share of a pool of the position based on total supply

```ts
Liquidity.getTokenBalances(params: Liquidity.GetTokenBalancesParams): Liquidity.GetTokenBalancesResult
```

Calculate the token balances for given pair Liquidity Position

```ts
Price.getByAmount(params: Price.GetPriceByAmountParams): BigNumber
```

Calculate the total amount price by a given amount

### Utils

The Utils module holds functions that have general propose usage. This functions are used inside other modules as well.

```ts
toBigNumber(num?: Types.Number): BigNumber
```

Converts a value to a BigNumber

```ts
toExponential(decimals: Types.Number): BigNumber
```

Create a toExponential notation by given decimals

```ts
formatAmount(amount: Types.Amount): string
```

Formats an amount to a small string with scientific notation

```ts
deserialize<T = any>(jsonString: string): T | undefined
```

Parses a json string into an object

This is required for parsing objects that have BigInt values

```ts
serialize<T>(data: T): string
```

Parses a json object into a string

This is required for parsing objects that have BigInt values

### Declarations

The declarations module provides the default constants used and typescript interfaces to help consuming the library.

#### Types

There are some declared types that we use in overall of our application to keep standardization of our params:

- `Types.Number`: It receives all possible representations of a number. (e.g. integer, float, percentage, bigint)

- `Types.Amount`: It is a string that represents the number that is shown on user interfaces. (e.g. token amount, money amount)

- `Types.Decimals`: It is always a integer that represents the decimals allowed on a DIP20 token.

#### Token

There are some declared types that we use to represent tokens and it's related stuff:

- `Token.Metadata`: It is an object containing information about a DIP20 token.

- `Token.MetadataList`: It is key-object that maps a list of `Token.Metadata`.

- `Token.Data`: It is an object containing the metadata and an amount of a token. It is used for turn easier pass data on operations.

- `Token.Balance`: It is an object that contains balances of certain token. The balances contained are `sonic`, `token` and `total` that represents balances from sonic, from wallet and the sum of both for a given principal id.

- `Token.BalanceList`: It is key-object that maps a list of `Token.Balance`.

#### Pair

There are some declared types that we use to represent Sonic swap pairs and it's related stuff.

- `Pair.Model`: It is an object containing information about the pair.

- `Pair.List`: It is key-object that maps a list of `Pair.Model`.

- `Pair.Balance`: It is a `Types.Number` that represents the Liquidity Position for a pair.

- `Pair.Balances`: It is key-object that maps a list of `Pair.Balance`.

#### Default

Default is an object that stores the default values used inside the library.

- `Default.IC_HOST`: The url to communicate with IC.

- `Default.SWAP_CANISTER_ID`: The Swap Canister id.

- `SLIPPAGE`: The default value used for calculations that has slippage as param.