'use client';

import { useState, useEffect } from 'react';
import { type Address } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { CrowdfundingABI } from '@/src/abis/Crowdfunding';
import { parseEther } from 'viem'; 

type CreateTierModalProps = {
  setIsModalOpen: (value: boolean) => void;
  campaignAddress: Address;
  onTierAdded: () => void;
};

export const CreateTierModal = ({ setIsModalOpen, campaignAddress, onTierAdded }: CreateTierModalProps) => {
  const [tierName, setTierName] = useState('');
  const [tierAmount, setTierAmount] = useState('0.1');

  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleAddTier = async () => {
    writeContract({
      address: campaignAddress,
      abi: CrowdfundingABI,
      functionName: 'addTier',
      args: [tierName, parseEther(tierAmount)],
      chainId: sepolia.id,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      onTierAdded();
      setIsModalOpen(false);
    }
  }, [isSuccess, onTierAdded, setIsModalOpen]); 

  return (
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="w-full max-w-md bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Create Funding Tier</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tier Name
            </label>
            <input
              type="text"
              value={tierName}
              onChange={(e) => setTierName(e.target.value)}
              placeholder="e.g., Basic Support"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount (ETH)
            </label>
            <input
              type="number"
              value={tierAmount}
              onChange={(e) => setTierAmount(e.target.value)}
              min="0.001"
              step="0.001"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleAddTier}
            disabled={isPending || isConfirming || !tierName || !tierAmount}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors mt-6"
          >
            {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Add Tier'}
          </button>
        </div>
      </div>
    </div>
  );
};