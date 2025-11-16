# TODO - DeFi Staking Platform

## Known Issues

### Transaction Failures
- **Stake transactions**: Sometimes fail with error message, sometimes show no activity/unknown status
- **Claim rewards transactions**: Similar issues with transaction success/failure reporting
- **Root cause**: Need to investigate transaction handling, gas estimation, and error feedback

## Next Steps

1. Add better error handling for failed transactions
2. Improve transaction status feedback in the UI
3. Add transaction confirmation messages with links to block explorer
4. Implement retry logic for failed transactions
5. Add loading states and better user feedback during transaction processing

## Debugging Steps

When investigating transaction failures:
1. Check MetaMask console for error messages
2. Verify gas limits are sufficient
3. Check contract allowances (for stake transactions)
4. Verify user has enough MATIC for gas fees
5. Check Polygon Amoy block explorer for transaction details
6. Review contract logs and events
