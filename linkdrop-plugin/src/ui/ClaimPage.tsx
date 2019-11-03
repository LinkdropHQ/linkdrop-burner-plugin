import React, { useEffect, useState } from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import { getHashVariables } from '@linkdrop/commons'
import { ethers } from 'ethers'
import LinkdropSDK from '@linkdrop/sdk/src/index'

const chain = "xdai"
const chainId = "100"
const infuraPk = "ecd43c9cd96e45ceb9131fba9b100b07"
const factoryAddress = "0xBa051891B752ecE3670671812486fe8dd34CC1c8"
const jsonRpcUrl = "https://dai.poa.network"
const apiHost = "https://xdai.linkdrop.io"

const getLinkdropSDK = ({
  factoryAddress,
  chain,
  linkdropMasterAddress,
  jsonRpcUrl,
  apiHost,
}) => {
  return new LinkdropSDK({
    factoryAddress,
    chain,
    linkdropMasterAddress,
    jsonRpcUrl,
    apiHost,
  })
}


const onSubmit = async ({ linkdropSDK, receiverAddress }) => {
  if (!linkdropSDK) {
    return console.error('SDK not found')
  }
  if (!receiverAddress) {
    return console.error('Receiver address not found')
  }

  const {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature,
    nftAddress,
    tokenId,
    campaignId
  } = getHashVariables()

  try {
    const { success, txHash, errors } = await linkdropSDK.claim({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress,
      campaignId
    })
    if (success) {
      return window.alert(`txHash: ${txHash}`)
    }
  } catch (err) {
    const { response: { data: { errors } = {} } = {} } = err
    if (errors) {
      window.alert(`error occured: ${errors[0]}`)
    }
  }
}

const checkIfClaimed = async ({ linkdropMasterAddress, linkKey, campaignId }) => {
  const abi = ["function isClaimedLink(address payable, uint, address) public view returns (bool)"]
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const linkWallet = new ethers.Wallet(linkKey)
  const linkId = linkWallet.address
  const factoryContract = new ethers.Contract(factoryAddress, abi, provider)
  return await factoryContract.isClaimedLink(linkdropMasterAddress, campaignId, linkId)
}




const ClaimPage: React.FC<PluginPageContext> = ({ burnerComponents, assets, defaultAccount }) => {
  const { Page, Button } = burnerComponents;

  const [claimed, setClaimed] = useState(false)
  const [loading, setLoading] = useState(true)

  const {
    weiAmount,
    tokenAmount,
    linkdropSignerSignature,
    linkdropMasterAddress,
    linkKey,
    campaignId
  } = getHashVariables()

  useEffect(() => {
    async function initialLinkCheck() {
      setLoading(true)
      const claimed = await checkIfClaimed({ linkdropMasterAddress, linkKey, campaignId })
      setClaimed(claimed)
      setLoading(false)
    }
    initialLinkCheck()
  }, []);



  const linkdropSDK = getLinkdropSDK({
    factoryAddress,
    chain,
    linkdropMasterAddress: (linkdropMasterAddress || defaultAccount),
    jsonRpcUrl,
    apiHost,
  })

  const renderButton = ({ loading, claimed }) => {
    if (loading) { return 'LOADING' }
    if (claimed) { return 'ALREADY CLAIMED' }
    return <Button
      disabled={!linkdropSignerSignature}
      onClick={_ => {
        onSubmit({ linkdropSDK, receiverAddress: defaultAccount })
      }}
    >
      Claim Tokens
    </Button>
  }

  return (
    <Page title="Claim Page">
      <div>Account: {defaultAccount}</div>

      <div>{weiAmount ? `Wei amount: ${weiAmount}` : ""}</div>
      <div>{tokenAmount ? `Token amount: ${tokenAmount}` : ""}</div>

      <br></br>
      <br></br>
      {renderButton({ loading, claimed })}
    </Page>
  );
};

export default ClaimPage;
