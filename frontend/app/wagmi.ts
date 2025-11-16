import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygonMumbai } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'DeFi Staking Platform',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [polygonMumbai],
  ssr: true,
});
