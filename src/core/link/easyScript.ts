import { ScriptBuilder } from "../vm";

export enum Nexus{
    Mainnet = "mainnet",
    Simnet = 'simnet',
    Testnet = 'testnet'
}

export class EasyScript {
    
    nexus: Nexus;
    sb: ScriptBuilder;

    constructor(nexus: Nexus = Nexus.Mainnet) {
        this.nexus = nexus;
    }

    async buildScript(_type: string, _options: Array<any> = [null]){

        this.sb = new ScriptBuilder();

        switch(_type){
            case 'interact':


                let contractNameInteract: string = _options[0];
                let methodNameInteract: string = _options[1];
                let inputArgumentsInteract: Array<string> = _options[2]


                return (
                this.sb
                .callContract('gas', 'AllowGas', [])
                .callContract(contractNameInteract, methodNameInteract, inputArgumentsInteract) //The Meat of the Script
                .callContract('gas', 'SpendGas', [])
                .endScript());
                
            break;

            case 'invoke':

                let contractNameInvoke: string = _options[0];
                let methodNameInvoke: string = _options[1];
                let inputArgumentsInvoke: Array<string> = _options[2]

                return (
                this.sb
                .callContract(contractNameInvoke, methodNameInvoke, inputArgumentsInvoke) //The Meat of the Script
                .endScript());

            break;

            case 'interop':
                
                let interopNameInterop: string = _options[0];
                let inputArgumentsInterop: Array<any> = _options[1];

                return (
                this.sb
                .callContract('gas', 'AllowGas', [])
                .callInterop(interopNameInterop, inputArgumentsInterop)
                .callContract('gas', 'SpendGas', [])
                .endScript());

            break;

        }

    }
    async contractDeployment(fromAddress, contractName, pvm, abi){
        return (
            await this.buildScript('interop', ["Runtime.DeployContract", [fromAddress, contractName, pvm, abi]])
        );
    }

    async sendFT(fromAddress: string, toAddress: string, tokenSymbol: string, amount: number){
        return (
            await this.buildScript('interop', ["Runtime.SendTokens", [fromAddress, toAddress, tokenSymbol, amount]])
        );
    }

    async sendNFT(fromAddress: string, toAddress: string, tokenSymbol: string, tokenId: number){
        return (
            await this.buildScript('interop', ["Runtime.SendTokens", [fromAddress, toAddress, tokenSymbol, tokenId]])
        );
    }


}