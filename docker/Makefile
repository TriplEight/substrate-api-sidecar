# Makefile
#
ifneq (,$(wildcard ./.env))
  include .env
  export
endif

get-chain-statemint:
	docker-compose -f docker-compose.statemint-chain.yml up
	docker-compose -f docker-compose.polkadot-chain.yml up

get-chain-statemine:
	docker-compose -f docker-compose.statemine-chain.yml up
	docker-compose -f docker-compose.kusama-chain.yml up

start-statemint:
	docker-compose  -f docker-compose.statemint.yml up

start-statemine:
	docker-compose  -f docker-compose.statemine.yml up -d
