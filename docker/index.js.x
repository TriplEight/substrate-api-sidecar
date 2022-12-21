#!/usr/bin/env node
// npm install node-fetch@2
const fetch = require('node-fetch');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config()

const data_dir = process.env.DATADIR || './data/';

const polkadot_config = {
    metadata_location: "https://storage.googleapis.com/parity-polkadot-backups/polkadot-rocksdb-prune/latest_version.meta.txt",
    backup_location: "gs://parity-polkadot-backups/polkadot-rocksdb-prune",
    chain_path: "polkadot/chains/polkadot/db/"
}

const statemint_config = {
    metadata_location: "https://storage.googleapis.com/parity-polkadot-backups/statemint-rocksdb-archive/latest_version.meta.txt",
    backup_location: "gs://parity-polkadot-backups/statemint-rocksdb-archive",
    chain_path: "chains/statemint/db/"
}

const kusama_config = {
    metadata_location: "https://storage.googleapis.com/parity-kusama-backups/kusama-rocksdb-prune/latest_version.meta.txt",
    backup_location: "gs://parity-kusama-backups/kusama-rocksdb-prune",
    chain_path: "polkadot/chains/ksmcc3/db/"
}

const statemine_config = {
    metadata_location: "https://storage.googleapis.com/parity-kusama-backups/statemine-rocksdb-archive/latest_version.meta.txt",
    backup_location: "gs://parity-kusama-backups/statemine-rocksdb-archive",
    chain_path: "chains/statemine/db/"
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


async function GsUtilSync(chain) {
  let gs_url = await resolveGsutilPath(chain);
   createFolder(chain);
  console.log("Syncing location: ", chain.backup_location);
  run('gsutil -m cp -r ' + gs_url + ' ' + data_dir + chain.chain_path);
}

const args = process.argv.slice(2);

switch (args[0]) {
  case 'polkadot':
    GsUtilSync(polkadot_config);
    break;
  case 'statemint':
    GsUtilSync(statemint_config);
    break;
  case 'kusama':
    GsUtilSync(kusama_config);
    break;
  case 'statemine':
    GsUtilSync(statemine_config);
    break;
  default:
    console.log('Unknown chain');
}





