'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { parseEther } from 'viem';
import { CROWDFUNDING_FACTORY_ADDRESS } from '@/src/constants/addresses';
import { CrowdfundingFactoryABI } from '@/src/abis/CrowdfundingFactory';

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void;
  onCampaignCreated: () => void;
};

export const CreateCampaignModal = ({ 
  setIsModalOpen, 
  onCampaignCreated 
}: CreateCampaignModalProps) => {
  const { address } = useAccount();
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('1');
  const [campaignDeadline, setCampaignDeadline] = useState('30');

  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleCreateCampaign = async () => {
    if (!address) return;

    writeContract({
      address: CROWDFUNDING_FACTORY_ADDRESS,
      abi: CrowdfundingFactoryABI,
      functionName: 'createCampaign',
      args: [
        campaignName,
        campaignDescription,
        parseEther(campaignGoal), // Конвертирует ETH в wei
        BigInt(campaignDeadline),
      ],
      chainId: sepolia.id,
    });
  };

  useEffect(() => {
   if (isSuccess) {
    onCampaignCreated(); 
    setIsModalOpen(false);
   }
  }, [isSuccess, onCampaignCreated]);

  return (
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center backdrop-blur-sm z-50">
      <div className="w-full max-w-2xl bg-slate-800 rounded-xl p-8 border border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create a Campaign</h2>
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
              Campaign Name
            </label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="Enter campaign name"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Campaign Description
            </label>
            <textarea
              value={campaignDescription}
              onChange={(e) => setCampaignDescription(e.target.value)}
              placeholder="Describe your campaign"
              rows={4}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Campaign Goal (ETH)
            </label>
            <input
              type="number"
              value={campaignGoal}
              onChange={(e) => setCampaignGoal(e.target.value)}
              min="0.001"
              step="0.001"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Campaign Length (Days)
            </label>
            <input
              type="number"
              value={campaignDeadline}
              onChange={(e) => setCampaignDeadline(e.target.value)}
              min="1"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleCreateCampaign}
            disabled={isPending || isConfirming || !campaignName || !campaignDescription}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors mt-6"
          >
            {isPending ? 'Confirm in Wallet...' : 
             isConfirming ? 'Creating Campaign...' : 
             'Create Campaign'}
          </button>
        </div>
      </div>
    </div>
  );
};