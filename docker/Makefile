# Makefile
#
ifneq (,$(wildcard ./.env))
  include .env
  export
endif

all:
	echo "test"
	env

get-chain-statemint:
	docker-compose -f docker-compose.statemint-chain.yml up

get-chain-polkadot:
	docker-compose -f docker-compose.polkadot-chain.yml up

start-statemint:
	docker-compose  -f docker-compose.statemint.yml up -d

start-statemint-foreground:
	docker-compose  -f docker-compose.statemint.yml up 

start-polkadot:
	docker-compose  -f docker-compose.polkadot.yml up -d

start-polkadot-foreground:
	docker-compose  -f docker-compose.polkadot.yml up


copy-polkadot-chain:
	mkdir -p polkadot-data/polkadot && cp -r statemint-data/polkadot polkadot-data/polkadot
