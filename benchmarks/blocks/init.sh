#!/bin/sh

wrk -d2m -t4 -c6 --timeout 120s --latency -s ./bench_blocks.lua http://127.0.0.1:8080
