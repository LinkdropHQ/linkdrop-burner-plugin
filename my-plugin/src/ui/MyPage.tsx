import React from 'react';
import { PluginPageContext } from '@burner-wallet/types';
import { Asset } from '@burner-wallet/assets';

const MyPage: React.FC<PluginPageContext> = ({ burnerComponents, assets, defaultAccount }) => {
  const { Page, Button } = burnerComponents;
  return (
    <Page title="Claim Page">
      <div>Account: {defaultAccount}</div>
      <div>Assets: {assets.map((asset: Asset) => asset.name).join(', ')}</div>
      <br></br>
      <br></br>
      <Button>Claim</Button>
    </Page>
  );
};

export default MyPage;
