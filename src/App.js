import React from 'react';
import './App.css';

import Web3 from "web3";
import CoolWalletSubProvider from '@coolwallets/web3-subprovider'
import ProviderEngine from "web3-provider-engine";
import RpcSubprovider from "web3-provider-engine/subproviders/rpc";

const engine = new ProviderEngine();
const rpcUrl = 'https://ropsten.infura.io/v3/44fd23cda65746a699a5d3c0e2fa45d5'

const options = {
  accountsLength: 5,
  accountsOffset: 0,
  networkId: 3
}
const coolwallet = new CoolWalletSubProvider(options)

engine.addProvider(coolwallet);
engine.addProvider(new RpcSubprovider({ rpcUrl }));
engine.start();

const web3 = new Web3(engine);

function App() {
  let from = '0xbAF99eD5b5663329FA417953007AFCC60f06F781';
  return (
    <div className="App">
      <header className="App-header">
        <button style={{fontSize:20}} onClick={()=> {
          web3.eth.getAccounts((error, accounts)=>{
            if(accounts) {
              from = accounts[0]
              console.log(from)
            }
            if(error) console.error(error)
          })
        }}>Get Accounts</button>
        <button style={{fontSize:20}} onClick={()=> {
          const tx = {
            "from": from,
            "nonce": "0x3b",
            "gasPrice": "0xe8754700",
            "gasLimit": "0x520c",
            "to": "0x81bb32e4A7e4d0500d11A52F3a5F60c9A6Ef126C",
            "value": "0x2386f26fc10000",
          }
          web3.eth.signTransaction(tx,(error, signed)=>{
            if(signed) {
              console.log(`signed`, signed)
              web3.eth.sendSignedTransaction(signed.raw, (err, hash)=>{
                if(err) console.error(err)
                if(hash) console.log(`tx hash: ${hash}`)
              })
            }
            if(error) console.error(error)
          })
        }}>Sign Transaction</button>

        <button style={{fontSize:20}} onClick={()=> {
          const message = 'CoolWalletIsCool'
          web3.eth.sign(message, from, (error, signature)=>{
            if(signature) {
              console.log(`signature`, signature)
            }
            if(error) console.error(error)
          })
        }}>Sign Message</button>
      </header>
    </div>
  );
}

export default App;