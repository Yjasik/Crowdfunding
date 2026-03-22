'use client';

import Link from 'next/link';
import { type Address, formatEther } from 'viem';
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
  
  const balanceInEth = balance ? formatEther(balance) : '0';
  const goalInEth = goal ? formatEther(goal) : '0';
  
  const progress = goal && balance 
    ? (Number(formatEther(balance)) / Number(formatEther(goal))) * 100 
    : 0;

  return (
    <Link href={`/campaign/${campaignAddress}`} className="block group">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group">
        <h3 className="text-xl font-bold text-white mb-2 truncate">
          {displayName}
        </h3>
        
        <p className="text-sm text-slate-400 mb-4 font-mono">
          {shortAddress}
        </p>

        <div className="mb-4">
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

        <div className="flex justify-between items-center text-sm font-medium gap-3">
          {/* Goal блок - темно-синий, слева */}
          <div className="bg-slate-800/80 px-3 py-2 rounded-lg border border-blue-800/50 flex-1">
            <span className="text-blue-300 block text-xs">Goal</span>
            <span className="text-blue-200 font-medium">{Number(goalInEth)} ETH</span>
          </div>
          {/* Raised блок - серый, справа */}
          <div className="bg-blue-950/80  px-3 py-2 rounded-lg border border-slate-700 flex-1">
            <span className="text-slate-400 block text-xs">Raised</span>
            <span className="text-slate-200 font-medium">{Number(balanceInEth).toFixed(1)} ETH</span>
          </div>
        </div>
      </div>
    </Link>
  );
};