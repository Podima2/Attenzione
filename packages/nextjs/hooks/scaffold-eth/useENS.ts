import { useScaffoldReadContract } from '~~/hooks/scaffold-eth'

export function useENSResolve(ensName: string | undefined) {
  const { data: address, isLoading } = useScaffoldReadContract({
    contractName: "MockENSRegistry",
    functionName: "resolve",
    args: [ensName || ""],
  })

  return {
    address: address as string | undefined,
    isLoading,
  }
}

export function useStationContract(stationId: string) {
  const ensName = `${stationId}.rome.crimenoviz.eth`
  const { address, isLoading } = useENSResolve(ensName)
  
  return {
    stationAddress: address,
    ensName,
    isLoading,
  }
}