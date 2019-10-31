import { BurnerPluginContext, Plugin, Actions } from '@burner-wallet/types';
import MyPage from './ui/MyPage';
import MyElement from './ui/MyElement';

interface PluginActionContext {
  actions: Actions;
}

export default class MyPlugin implements Plugin {
  private pluginContext?: BurnerPluginContext;

  initializePlugin(pluginContext: BurnerPluginContext) {
    this.pluginContext = pluginContext;

    pluginContext.addPage('/claim', MyPage);
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
