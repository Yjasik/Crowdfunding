'use client';

import { useState } from 'react';
import { type Address } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { CrowdfundingABI } from '@/src/abis/Crowdfunding';

type FundTierModalProps = {
  setIsModalOpen: (value: boolean) => void;
  campaignAddress: Address;
  tierIndex: number;
  tierAmount: bigint;
  tierName: string;
};

export const FundTierModal = ({ 
  setIsModalOpen, 
  campaignAddress, 
  tierIndex, 
  tierAmount, 
  tierName 
}: FundTierModalProps) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleFund = async () => {
    writeContract({
      address: campaignAddress,
      abi: CrowdfundingABI,
      functionName: 'fund',
      args: [BigInt(tierIndex)],
      value: tierAmount,
      chainId: sepolia.id,
    });
  };

  if (isSuccess) {
    setIsModalOpen(false);
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="w-full max-w-md bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Confirm Funding</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Tier:</span>
              <span className="text-white font-medium">{tierName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Amount:</span>
              <span className="text-white font-medium">{tierAmount.toString()} ETH</span>
            </div>
          </div>

          {!isConfirmed ? (
            <button
              onClick={() => setIsConfirmed(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Continue to Payment
            </button>
          ) : (
            <button
              onClick={handleFund}
              disabled={isPending || isConfirming}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
            >
              {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : `Pay ${tierAmount.toString()} ETH`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};