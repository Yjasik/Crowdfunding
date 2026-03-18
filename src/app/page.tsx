// 'use client';

// import { useReadContract } from 'wagmi';
// import { sepolia } from 'wagmi/chains';
// import { CampaignCard } from '@/src/components/CampaignCard';
// import { CROWDFUNDING_FACTORY_ADDRESS } from '@/src/constants/addresses';
// import { CrowdfundingFactoryABI } from '@/src/abis/CrowdfundingFactory';

// // Тип для кампании из контракта
// type Campaign = {
//   campaignAddress: `0x${string}`;
//   owner: `0x${string}`;
//   name: string;
//   creationTime: bigint;
// };

// export default function Home() {
//   // Чтение всех кампаний из контракта
//   const { 
//     data: campaigns, 
//     isLoading: isLoadingCampaigns, 
//     refetch: refetchCampaigns,
//     error 
//   } = useReadContract({
//     address: CROWDFUNDING_FACTORY_ADDRESS as `0x${string}`,
//     abi: CrowdfundingFactoryABI,
//     functionName: 'getAllCampaigns',
//     chainId: sepolia.id,
//     args: [],
//   });

//   // Обработка ошибок
//   if (error) {
//     console.error('Error loading campaigns:', error);
//     return (
//       <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
//         <div className="py-10">
//           <h1 className="text-4xl font-bold mb-4">Campaigns</h1>
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//             <p>Error loading campaigns. Please try again later.</p>
//             <p className="text-sm">{error.message}</p>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
//       <div className="py-10">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-4xl font-bold">Campaigns</h1>
//           <button
//             onClick={() => refetchCampaigns()}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//             disabled={isLoadingCampaigns}
//           >
//             {isLoadingCampaigns ? 'Loading...' : 'Refresh'}
//           </button>
//         </div>

//         {isLoadingCampaigns ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {campaigns && campaigns.length > 0 ? (
//               (campaigns as Campaign[]).map((campaign) => (
//                 <CampaignCard
//                   key={campaign.campaignAddress}
//                   campaignAddress={campaign.campaignAddress}
//                   name={campaign.name}
//                   owner={campaign.owner}
//                 />
//               ))
//             ) : (
//               <div className="col-span-full text-center py-10">
//                 <p className="text-gray-500 text-lg">No campaigns found</p>
//                 <p className="text-gray-400 mt-2">Be the first to create a campaign!</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

// app/page.tsx - временная версия для проверки интерфейса

'use client';

import { CampaignCard } from '@/src/components/CampaignCard';

const MOCK_CAMPAIGNS = [
  {
    campaignAddress: "0x1234...5678",
    name: "Save the Rainforest",
    description: "Help us protect 1000 acres of rainforest from deforestation and preserve biodiversity for future generations.",
    goal: "10",
    balance: "3.5"
  },
  {
    campaignAddress: "0x2345...6789",
    name: "Clean Ocean Initiative",
    description: "Removing plastic from the Pacific Ocean using innovative collection systems and recycling technology.",
    goal: "5",
    balance: "4.2"
  },
  {
    campaignAddress: "0x3456...7890",
    name: "Solar for Schools",
    description: "Installing solar panels in underserved schools to reduce energy costs and provide clean power.",
    goal: "15",
    balance: "2.8"
  },
  {
    campaignAddress: "0x4567...8901",
    name: "Community Garden Project",
    description: "Creating urban gardens in food deserts to provide fresh produce and education about sustainable farming.",
    goal: "8",
    balance: "6.1"
  },
  {
    campaignAddress: "0x5678...9012",
    name: "Tech Education for Girls",
    description: "Providing coding classes and mentorship for girls in underprivileged communities.",
    goal: "12",
    balance: "9.3"
  },
  {
    campaignAddress: "0x6789...0123",
    name: "Wildlife Conservation",
    description: "Protecting endangered species through habitat preservation and anti-poaching efforts.",
    goal: "20",
    balance: "7.5"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
            Discover Campaigns
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Support innovative projects and make a difference in the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_CAMPAIGNS.map((campaign) => (
            <CampaignCard
              key={campaign.campaignAddress}
              campaignAddress={campaign.campaignAddress as `0x${string}`}
              name={campaign.name}
              initialDescription={campaign.description}
              initialGoal={campaign.goal}
              initialBalance={campaign.balance}
            />
          ))}
        </div>
      </div>
    </main>
  );
}