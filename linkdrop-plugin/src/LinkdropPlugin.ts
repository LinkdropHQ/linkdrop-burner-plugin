import { BurnerPluginContext, Plugin, Actions } from '@burner-wallet/types';
import ClaimPage from './ui/ClaimPage';
import MyElement from './ui/MyElement';

interface PluginActionContext {
  actions: Actions;
}

export default class LinkdropPlugin implements Plugin {
  private pluginContext?: BurnerPluginContext;

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;

    pluginContext.addPage('/claim', ClaimPage);
    pluginContext.addButton('apps', 'Claim', '/claim', {
      description: 'Linkdrop claim page',
    });
    pluginContext.addElement('home-middle', MyElement);

    onQRScanned: ((scan: string, ctx: PluginActionContext) => {
      if (scan === 'Linkdrop Claim Plugin') {
        ctx.actions.navigateTo('/claim');
        return true;
      }
    });
  }

  async getBlockNum() {
    const assets = this.pluginContext!.getAssets();
    const web3 = this.pluginContext!.getWeb3(assets[0].network);
    const blockNum = web3.eth.getBlockNumber();
    return blockNum;
  }
}
