import React from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import { Asset } from '@burner-wallet/assets';
import { getHashVariables } from '@linkdrop/commons'

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

  console.log({ success, txHash, errors })
}




const ClaimPage: React.FC<PluginPageContext> = ({ burnerComponents, assets, defaultAccount }) => {
  const { Page, Button } = burnerComponents;

  const linkdropSDK = getLinkdropSDK({
    factoryAddress,
    chain,
    linkdropMasterAddress: defaultAccount,
    jsonRpcUrl,
    apiHost,
  })


  const {
    weiAmount,
    tokenAmount,
    linkdropSignerSignature,
  } = getHashVariables()


  return (
    <Page title="Claim Page">
      <div>Account: {defaultAccount}</div>

      <div>{weiAmount ? `Wei amount: ${weiAmount}` : ""}</div>
      <div>{tokenAmount ? `Token amount: ${tokenAmount}` : ""}</div>

      <br></br>
      <br></br>
      <Button
        disabled={!linkdropSignerSignature}
        onClick={_ => onSubmit({ linkdropSDK, receiverAddress: defaultAccount })}
      >
        Claim Tokens
      </Button>
    </Page>
  );
};

export default ClaimPage;
