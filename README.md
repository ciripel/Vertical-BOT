## Vertical-BOT v.1.0

### Discord bot for Vertical

v.1.0 - deployed 20.05.2018
- initial version

$ make test-integration ARGS="-v -run=TestIntegration/bitcloud=main"
=== RUN   TestIntegration
=== RUN   TestIntegration/bitcloud=main
=== RUN   TestIntegration/bitcloud=main/rpc
=== RUN   TestIntegration/bitcloud=main/rpc/GetBlock
=== RUN   TestIntegration/bitcloud=main/rpc/GetBlockHash
=== RUN   TestIntegration/bitcloud=main/rpc/GetTransaction
=== RUN   TestIntegration/bitcloud=main/rpc/GetTransactionForMempool
=== RUN   TestIntegration/bitcloud=main/rpc/MempoolSync
=== RUN   TestIntegration/bitcloud=main/rpc/GetBestBlockHash
=== RUN   TestIntegration/bitcloud=main/rpc/GetBestBlockHeight
=== RUN   TestIntegration/bitcloud=main/sync
=== RUN   TestIntegration/bitcloud=main/sync/ConnectBlocksParallel
=== RUN   TestIntegration/bitcloud=main/sync/ConnectBlocksParallel/verifyBlockInfo
=== RUN   TestIntegration/bitcloud=main/sync/ConnectBlocksParallel/verifyTransactions
=== RUN   TestIntegration/bitcloud=main/sync/ConnectBlocksParallel/verifyAddresses
=== RUN   TestIntegration/bitcloud=main/sync/ConnectBlocks
=== RUN   TestIntegration/bitcloud=main/sync/ConnectBlocks/verifyBlockInfo
=== RUN   TestIntegration/bitcloud=main/sync/ConnectBlocks/verifyTransactions
=== RUN   TestIntegration/bitcloud=main/sync/ConnectBlocks/verifyAddresses
--- PASS: TestIntegration (0.49s)
    --- PASS: TestIntegration/bitcloud=main (0.49s)
        --- PASS: TestIntegration/bitcloud=main/rpc (0.02s)
            --- PASS: TestIntegration/bitcloud=main/rpc/GetBlock (0.01s)
            --- PASS: TestIntegration/bitcloud=main/rpc/GetBlockHash (0.00s)
            --- PASS: TestIntegration/bitcloud=main/rpc/GetTransaction (0.00s)
            --- PASS: TestIntegration/bitcloud=main/rpc/GetTransactionForMempool (0.00s)
            --- SKIP: TestIntegration/bitcloud=main/rpc/MempoolSync (0.00s)
                rpc.go:394: Skipping test, mempool is empty
            --- PASS: TestIntegration/bitcloud=main/rpc/GetBestBlockHash (0.00s)
            --- PASS: TestIntegration/bitcloud=main/rpc/GetBestBlockHeight (0.00s)
        --- PASS: TestIntegration/bitcloud=main/sync (0.45s)
            --- PASS: TestIntegration/bitcloud=main/sync/ConnectBlocksParallel (0.36s)
                --- PASS: TestIntegration/bitcloud=main/sync/ConnectBlocksParallel/verifyBlockInfo (0.00s)
                --- PASS: TestIntegration/bitcloud=main/sync/ConnectBlocksParallel/verifyTransactions (0.00s)
                --- PASS: TestIntegration/bitcloud=main/sync/ConnectBlocksParallel/verifyAddresses (0.00s)
            --- PASS: TestIntegration/bitcloud=main/sync/ConnectBlocks (0.09s)
                --- PASS: TestIntegration/bitcloud=main/sync/ConnectBlocks/verifyBlockInfo (0.00s)
                --- PASS: TestIntegration/bitcloud=main/sync/ConnectBlocks/verifyTransactions (0.00s)
                --- PASS: TestIntegration/bitcloud=main/sync/ConnectBlocks/verifyAddresses (0.00s)
PASS
ok      blockbook/tests 0.684s
