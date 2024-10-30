<h1 align="center">xycontract</h1>

## Install

```sh
npm install xycontract --save
```

```sh
yarn add xycontract
```

## Synopsis

```js
import { createContract } from 'xycontract'

const contractConfig = createContract({
  providerUrl: 'https://bsc-dataseed1.ninicoin.io',
})

const ContractInstance = contractConfig(BeiConstAbi, config.bei)

// 读方法
// read(name, bigNumber, ...params)
ContractInstance.read('credits', false, id)

// 写方法
// read(name, ...params)
ContractInstance.write('withdrawReward', toWei(5), false)
```
