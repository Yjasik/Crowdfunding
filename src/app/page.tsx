'use client';

import { useReadContract } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { CampaignCard } from '@/src/components/CampaignCard';
import { CROWDFUNDING_FACTORY_ADDRESS } from '@/src/constants/addresses';
import { CrowdfundingFactoryABI } from '@/src/abis/CrowdfundingFactory';

// Тип для кампании из контракта
type Campaign = {
  campaignAddress: `0x${string}`;
  owner: `0x${string}`;
  name: string;
  creationTime: bigint;
};

export default function Home() {
  // Чтение всех кампаний из контракта
  const { 
    data: campaigns, 
    isLoading: isLoadingCampaigns, 
    refetch: refetchCampaigns,
    error 
  } = useReadContract({
    address: CROWDFUNDING_FACTORY_ADDRESS as `0x${string}`,
    abi: CrowdfundingFactoryABI,
    functionName: 'getAllCampaigns',
    chainId: sepolia.id,
    args: [],
  });

  // Обработка ошибок
  if (error) {
    console.error('Error loading campaigns:', error);
    return (
      <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <h1 className="text-4xl font-bold mb-4">Campaigns</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>Error loading campaigns. Please try again later.</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
      <div className="py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Campaigns</h1>
          <button
            onClick={() => refetchCampaigns()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            disabled={isLoadingCampaigns}
          >
            {isLoadingCampaigns ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {isLoadingCampaigns ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns && campaigns.length > 0 ? (
              (campaigns as Campaign[]).map((campaign) => (
                <CampaignCard
                  key={campaign.campaignAddress}
                  campaignAddress={campaign.campaignAddress}
                  name={campaign.name}
                  owner={campaign.owner}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">No campaigns found</p>
                <p className="text-gray-400 mt-2">Be the first to create a campaign!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
