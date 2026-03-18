
'use client';

import { useState } from 'react'; 
import { useReadContract } from 'wagmi';
import { type Address } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import { CrowdfundingABI } from '@/src/abis/Crowdfunding';
import { FundTierModal } from './FundTierModal';

type TierCardProps = {
  tier: {
    name: string;
    amount: bigint;
    backers: bigint;
  };
  index: number;
  campaignAddress: Address;
  isEditing: boolean;
};

export const TierCard = ({ tier, index, campaignAddress, isEditing }: TierCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: backersCount } = useReadContract({
    address: campaignAddress,
    abi: CrowdfundingABI,
    functionName: 'tiers',
    args: [BigInt(index)],
    chainId: baseSepolia.id,
  });

  const displayBackers = backersCount ? (backersCount as any).backers?.toString() || '0' : tier.backers.toString();

  return (
    <>
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all group">
        <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
        <div className="text-2xl font-bold text-blue-400 mb-4">
          {tier.amount.toString()} ETH
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-400">Backers</span>
          <span className="text-white font-semibold">{displayBackers}</span>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Fund This Tier
          </button>
        )}
      </div>

      {isModalOpen && (
        <FundTierModal
          setIsModalOpen={setIsModalOpen}
          campaignAddress={campaignAddress}
          tierIndex={index}
          tierAmount={tier.amount}
          tierName={tier.name}
        />
      )}
    </>
  );
};