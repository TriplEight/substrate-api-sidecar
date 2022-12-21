#!/usr/bin/env node
// npm install node-fetch@2
const fetch = require('node-fetch');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config()

const util = require('util');
const { resolve } = require('path');
const streamPipeline = util.promisify(require('stream').pipeline)

const data_dir = process.env.DATADIR || '/polkadot';

const polkadot_config = {
    metadata_location: "https://storage.googleapis.com/parity-polkadot-backups/polkadot-rocksdb-prune/latest_version.meta.txt",
    backup_location: "gs://parity-polkadot-backups/polkadot-rocksdb-prune",
    chain_path: "/polkadot/chains/polkadot/db/"
}

const statemint_config = {
    metadata_location: "https://storage.googleapis.com/parity-polkadot-backups/statemint-rocksdb-archive/latest_version.meta.txt",
    backup_location: "gs://parity-polkadot-backups/statemint-rocksdb-archive",
    chain_path: "/chains/statemint/db/"
}

const kusama_config = {
    metadata_location: "https://storage.googleapis.com/parity-kusama-backups/kusama-rocksdb-prune/latest_version.meta.txt",
    backup_location: "gs://parity-kusama-backups/kusama-rocksdb-prune",
    chain_path: "/polkadot/chains/ksmcc3/db/"
}

const statemine_config = {
    metadata_location: "https://storage.googleapis.com/parity-kusama-backups/statemine-rocksdb-archive/latest_version.meta.txt",
    backup_location: "gs://parity-kusama-backups/statemine-rocksdb-archive",
    chain_path: "/chains/statemine/db/"
}

async function run (cmd) {
    exec(cmd, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    });
}

async function resolveGsutilPath(chain) {
    const response = await fetch(chain.metadata_location);
    let meta =  await response.text();
    meta = meta.trim();
    const url = `${chain.backup_location}/${meta}/*`;
    return url;
}

async function createFolder(chain) {
    try {
        if (!fs.existsSync(chain.chain_path)){
          fs.mkdirSync(`${data_dir}/${chain.chain_path}`, { recursive: true });         
        }
      } catch (err) {
        console.error(err);
      }
}

const downloadFile = async (url, path) => pipeline(
  (await fetch(url)).body,
  createWriteStream(path)
);

function setPermissions(chain) {
    try {
      console.log("setting permissions on", chain.chain_path);
      console.log(`chown -R ${process.env.CONTAINER_UID}:${process.env.CONTAINER_UID} ${data_dir}/${chain.chain_path}`);
      run(`chown -R ${process.env.CONTAINER_UID}:${process.env.CONTAINER_UID} ${data_dir}/${chain.chain_path}`);
      run(`chmod -R 775 ${data_dir}/${chain.chain_path}`);
    } catch (err) {
      console.log("permission error");
      console.error(err);
    }
}

async function GsUtilSync(chain) {
  let gs_url = await resolveGsutilPath(chain);
    createFolder(chain);
    console.log("Syncing location: ", chain.backup_location);
    console.log('/root/google-cloud-sdk/bin  cp -r ' + gs_url + ' ' + data_dir + chain.chain_path);
    run('/usr/bin/gsutil -m -q  cp -r ' + gs_url + ' ' + data_dir + chain.chain_path);
}
async function TarSync(chain) { 

  const response = await fetch(chain.backup_location)
  createFolder(chain);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)

  await streamPipeline(response.body, fs.createWriteStream(`${data_dir}/${chain.chain_path}/temp.tar`));
  console.log(`tar xvf ${data_dir}/${chain.chain_path}/temp.tar -C ${data_dir}/${chain.chain_path} --owner ${process.env.CONTAINER_UID}`);
  console.log("finished tar sync");
  run(`tar xf ${data_dir}/${chain.chain_path}/temp.tar -C ${data_dir}/${chain.chain_path}`);
  return;
}

async function syncRelayChain(chain) {
  switch (process.env.RELAYCHAIN) {
    case 'polkadot':
      GsUtilSync(polkadot_config);
      break;
    case 'kusama':                                                                                                                                                          
      GsUtilSync(kusama_config);
      break;
    default:
      if (process.env.RELAYCHAIN_BACKUP_LOCATION.endsWith('.tar')) {
        const relaychain_unknown_config = {
          backup_location: process.env.RELAYCHAIN_BACKUP_LOCATION,
          chain_path: process.env.RELAYCHAIN_RESTORE_PATH
         }

         await TarSync(relaychain_unknown_config);
         await new Promise(resolve => setTimeout(resolve, 1000));
                  setPermissions(relaychain_unknown_config);

      }
      else {
        console.log("No archive found for relaychain", chain);
      }
      console.log('Unknown relaychain: ', chain);      
  }
}

async function syncParaChain(chain) {

  switch (process.env.PARACHAIN) {
    case 'statemine':
      GsUtilSync(statemine_config);
      break;
    case 'statemint':                                                                                                                                                          
      GsUtilSync(statemint_config);
      break;
    default:
      if (process.env.PARACHAIN_BACKUP_LOCATION.endsWith('.tar')) {
        const parachain_unknown_config = {
          backup_location: process.env.PARACHAIN_BACKUP_LOCATION,
          chain_path: process.env.PARACHAIN_RESTORE_PATH
         }
         console.log("tar sync");
         await TarSync(parachain_unknown_config);
         console.log("done with syncparachain");
         await new Promise(resolve => setTimeout(resolve, 1000));
         setPermissions(parachain_unknown_config);
         break;
         
      }
      else {
        console.log("No archive found for parachain", chain);
      }
      console.log('Unknown parachain: ', chain);      
  }

}


async function main () {
  syncParaChain(process.env.PARACHAIN);
  syncRelayChain(process.env.RELAYCHAIN);
}


console.log(process.env.RELAYCHAIN);
console.log(process.env.PARACHAIN);

main();
console.log("done");

