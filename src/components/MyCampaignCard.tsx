'use client';

import Link from 'next/link';
import { type Address } from 'viem';
import { useReadContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { CrowdfundingABI } from '@/src/abis/Crowdfunding';

type MyCampaignCardProps = {
  campaignAddress: Address;
  campaignName?: string;
};

export const MyCampaignCard = ({ campaignAddress, campaignName: initialName }: MyCampaignCardProps) => {
  const { data: name } = useReadContract({
    address: campaignAddress,
    abi: CrowdfundingABI,
    functionName: 'name',
    chainId: sepolia.id,
  });

  const { data: balance } = useReadContract({
    address: campaignAddress,
    abi: CrowdfundingABI,
    functionName: 'getContractBalance',
    chainId: sepolia.id,
  });

  const { data: goal } = useReadContract({
    address: campaignAddress,
    abi: CrowdfundingABI,
    functionName: 'goal',
    chainId: sepolia.id,
  });

  const displayName = name || initialName || 'Untitled Campaign';
  const shortAddress = `${campaignAddress.slice(0, 6)}...${campaignAddress.slice(-4)}`;
  
  const progress = goal && balance 
    ? (Number(balance) / Number(goal)) * 100 
    : 0;

  return (
    <Link href={`/campaign/${campaignAddress}`}>
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group">
        <h3 className="text-xl font-bold text-white mb-2 truncate">
          {displayName}
        </h3>
        
        <p className="text-sm text-slate-400 mb-4 font-mono">
          {shortAddress}
        </p>

        <div className="mb-2">
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>Progress</span>
            <span className="text-blue-400">{Math.min(progress, 100).toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-sm text-slate-400">
          <span>Raised: {balance?.toString() || '0'} ETH</span>
          <span>Goal: {goal?.toString() || '0'} ETH</span>
        </div>
      </div>
    </Link>
  );
};