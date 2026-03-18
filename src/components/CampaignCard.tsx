'use client';

import Link from 'next/link';
import { useReadContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { CrowdfundingABI } from '@/src/abis/Crowdfunding';

type CampaignCardProps = {
  campaignAddress: `0x${string}`;
  name?: string;
  owner?: `0x${string}`;
  initialDescription?: string;
  initialGoal?: string;
  initialBalance?: string;
};

export const CampaignCard = ({ 
  campaignAddress, 
  name: initialName,
  initialDescription,
  initialGoal,
  initialBalance 
}: CampaignCardProps) => {
  const { data: campaignName } = useReadContract({
    address: campaignAddress,
    abi: CrowdfundingABI,
    functionName: 'name',
    chainId: sepolia.id,
  });

  const { data: description } = useReadContract({
    address: campaignAddress,
    abi: CrowdfundingABI,
    functionName: 'description',
    chainId: sepolia.id,
  });

  const { data: goal } = useReadContract({
    address: campaignAddress,
    abi: CrowdfundingABI,
    functionName: 'goal',
    chainId: sepolia.id,
  });

  const { data: balance } = useReadContract({
    address: campaignAddress,
    abi: CrowdfundingABI,
    functionName: 'getContractBalance',
    chainId: sepolia.id,
  });

  // Используем переданные пропсы или данные из контракта
  const displayName = campaignName || initialName || 'Untitled Campaign';
  const displayDescription = description || initialDescription || 'No description';
  const displayGoal = goal?.toString() || initialGoal || '0';
  const displayBalance = balance?.toString() || initialBalance || '0';

  const progress = displayGoal && displayBalance
    ? (Number(displayBalance) / Number(displayGoal)) * 100
    : 0;

  const shortAddress = `${campaignAddress.slice(0, 6)}...${campaignAddress.slice(-4)}`;

  return (
    <Link href={`/campaign/${campaignAddress}`} className="block group">
      <div className="border-2 border-slate-200 rounded-lg p-6 bg-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 cursor-pointer">
        <h3 className="text-2xl font-bold text-slate-800 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {displayName}
        </h3>
        
        <p className="text-slate-600 text-base mb-4 line-clamp-2">
          {displayDescription}
        </p>
        
        <div className="text-sm text-slate-500 mb-4">
          <span className="font-mono bg-slate-100 px-2 py-1 rounded">
            {shortAddress}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
            <span>Progress</span>
            <span className="text-blue-600">{Math.min(Math.round(progress), 100)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-blue-700" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm font-medium">
          <div className="bg-slate-50 px-3 py-2 rounded-lg">
            <span className="text-slate-600">Goal: </span>
            <span className="text-slate-900">{displayGoal} ETH</span>
          </div>
          <div className="bg-blue-50 px-3 py-2 rounded-lg">
            <span className="text-blue-600">Raised: </span>
            <span className="text-blue-700">{displayBalance} ETH</span>
          </div>
        </div>
      </div>
    </Link>
  );
};