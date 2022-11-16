# docker-compose scripts for polkadot and statemint


## Usage 

## Download Chain

The first thing to do is download a chain archive. YOu can do this using one of two commands:


```
make get-chain-statemint
```

and

```
make get-chain-polkadot
```

Note that using `get-chain-statemint` will download both polkadot and statemint databases.

This should take about one hour:

```
Copying gs://parity-polkadot-backups/polkadot-rocksdb-prune/20221115-011831/full/parachains/db/LOCK...
Copying gs://parity-polkadot-backups/polkadot-rocksdb-prune/20221115-011831/full/parachains/db/IDENTITY...
Copying gs://parity-polkadot-backups/polkadot-rocksdb-prune/20221115-011831/full/parachains/db/LOG...
Copying gs://parity-polkadot-backups/polkadot-rocksdb-prune/20221115-011831/full/parachains/db/MANIFEST-173091...
Copying gs://parity-polkadot-backups/polkadot-rocksdb-prune/20221115-011831/full/parachains/db/OPTIONS-171840...
Copying gs://parity-polkadot-backups/polkadot-rocksdb-prune/20221115-011831/full/parachains/db/OPTIONS-173094...
Copying gs://parity-polkadot-backups/polkadot-rocksdb-prune/20221115-011831/full/parachains/db/parachain_db_version...
/ [77.6k/77.6k files][151.6 GiB/151.6 GiB] 100% Done  52.7 MiB/s ETA 00:00:00   MiB/s ETA 00:00:03   
polkadot-chain     | Operation completed over 77.6k objects/151.6 GiB.                                
polkadot-chain exited with code 0

real    60m33.243s
user    0m41.265s
sys     0m11.453s
```

## Start a chain

You can start a chain using the commands `make start-statemint` ,this will daemonise the process. To start in the foreground run: `make start-statemint-foreground`. 

The same commands (`start-polkadot` and `start-polkadot-foreground` exist for polkadot). 

Example with statemint, almost fully synced on both chains:
```
make start-statemint
[...]
statemint   | 2022-11-15 23:56:34 [Parachain] ?  Syncing 79.5 bps, target=#2568547 (9 peers), best: #2562235 (0x68d2?e49e), finalized #2561698 (0xbcee?2822), ? 662.8kiB/s ? 23.0kiB/s    
statemint   | 2022-11-15 23:56:34 [Relaychain] ?  Syncing  6.9 bps, target=#12942547 (40 peers), best: #12929085 (0xf2cc?ef6e), finalized #12929024 (0xb003?cb2e), ? 615.1kiB/s ? 385.8kiB/s   
```
