import { JsonRpcSigner } from '@ethersproject/providers'
import { BigNumber, ethers } from 'ethers'
import { calculateGasMargin, failResult, successResult } from './ethersUtils'
import { formatUnits } from 'ethers/lib/utils'

export function toWei(amount: string | number, tokenDecimals = 18) {
  if (typeof amount === 'number') {
    amount = amount + ''
  }
  return ethers.utils.parseUnits(amount, tokenDecimals)
}

export const formatBigNumber = (
  number: ethers.BigNumber = toWei(0),
  displayDecimals = 18,
  decimals = 18
) => {
  const remainder = number.mod(
    ethers.BigNumber.from(10).pow(decimals - displayDecimals)
  )
  const res = formatUnits(number.sub(remainder), decimals)
  return res === '0.0' ? '0' : res
}

export const createContract = ({ providerUrl }) => {
  let provider
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum)
  } catch (error) {
    provider = new ethers.providers.JsonRpcProvider(providerUrl)
  }
  const signer: JsonRpcSigner = provider.getSigner()

  const getContract = (abi: any, address: string) => {
    const fixedGasPrice = ethers.utils.parseUnits('1', 'gwei') // 设置为 1 Gwei
    const overrides = {
      gasPrice: fixedGasPrice,
    }

    const signerOrProvider = signer
    const ContractInstance = new ethers.Contract(address, abi, signerOrProvider)

    function getContractMethods() {}

    const contractMethods = new getContractMethods()

    contractMethods.read = async (name, big: boolean, ...params) => {
      try {
        const resp = await ContractInstance[name](...params)
        if (big) {
          return +formatBigNumber(resp)
        } else {
          return resp
        }
      } catch (error) {
        failResult(error)
      }
    }

    contractMethods.write = async (name, ...params) => {
      try {
        const gasEstimated = (await ContractInstance.estimateGas[name](
          ...params
        )) as BigNumber
        const resp = await (
          await ContractInstance[name](...params, {
            gasLimit: calculateGasMargin(gasEstimated, 1000),
            ...overrides,
          })
        ).wait()
        return successResult(resp)
      } catch (error) {
        return failResult(error)
      }
    }
    return contractMethods
  }

  return getContract
}
