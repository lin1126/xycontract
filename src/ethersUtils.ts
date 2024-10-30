import { ethers } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'

// 统一错误返回
export const failResult = <T extends Error | string>(
  result: T
): web3Result<T> => ({
  success: false,
  result,
}) // 统一成功返回
export const successResult = <T>(result: T): web3Result<T> => ({
  success: true,
  result,
})

// add 10%
export const calculateGasMargin = (
  value: BigNumber,
  margin = 1000
): BigNumber => {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(margin)))
    .div(BigNumber.from(10000))
}
