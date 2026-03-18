'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { type Address } from 'viem';
import { sepolia } from 'wagmi/chains';
import { MyCampaignCard } from '@/src/components/MyCampaignCard';
import { CreateCampaignModal } from '@/src/components/CreateCampaignModal';
import { CROWDFUNDING_FACTORY_ADDRESS } from '@/src/constants/addresses';
import { CrowdfundingFactoryABI } from '@/src/abis/CrowdfundingFactory';

type Campaign = {
  campaignAddress: Address;
  owner: Address;
  name: string;
  creationTime: bigint;
};

export default function DashboardPage() {
  const { address: userAddress } = useAccount();
  const params = useParams();
  const dashboardAddress = params?.address as Address;
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Проверка, что пользователь смотрит свой дашборд
  const isOwnDashboard = userAddress && dashboardAddress && 
    userAddress.toLowerCase() === dashboardAddress.toLowerCase();

  // Получение кампаний пользователя
  const { 
    data: myCampaigns, 
    isLoading: isLoadingMyCampaigns, 
    refetch: refetchCampaigns 
  } = useReadContract({
    address: CROWDFUNDING_FACTORY_ADDRESS,
    abi: CrowdfundingFactoryABI,
    functionName: 'getUserCampaigns',
    args: [dashboardAddress],
    chainId: sepolia.id,
    query: {
      enabled: !!dashboardAddress, // Запрос только если есть адрес
    }
  });

  if (!dashboardAddress) {
    return (
      <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
        <p>Invalid dashboard address</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        {isOwnDashboard && (
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Create Campaign
          </button>
        )}
      </div>

      <h2 className="text-2xl font-semibold text-white mb-4">My Campaigns:</h2>
      
      {isLoadingMyCampaigns ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-700/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myCampaigns && (myCampaigns as Campaign[]).length > 0 ? (
            (myCampaigns as Campaign[]).map((campaign) => (
              <MyCampaignCard
                key={campaign.campaignAddress}
                campaignAddress={campaign.campaignAddress}
                campaignName={campaign.name}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-lg">No campaigns found</p>
              {isOwnDashboard && (
                <p className="text-slate-500 mt-2">
                  Click "Create Campaign" to start your first campaign!
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <CreateCampaignModal
          setIsModalOpen={setIsModalOpen}
          onCampaignCreated={refetchCampaigns}
        />
      )}
    </div>
  );
}