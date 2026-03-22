'use client';

import { useAccount, useReadContract } from 'wagmi';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { type Address, formatEther } from 'viem';
import { sepolia } from 'wagmi/chains';
import { TierCard } from '@/src/components/TierCard';
import { CreateTierModal } from '@/src/components/CreateTierModal';
import { CrowdfundingABI } from '@/src/abis/Crowdfunding';

export default function CampaignPage() {
  const { address: userAddress } = useAccount();
  const { campaignAddress } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const campaignAddr = campaignAddress as Address;

  // Название кампании
  const { data: name, isLoading: isLoadingName } = useReadContract({
    address: campaignAddr,
    abi: CrowdfundingABI,
    functionName: 'name',
    chainId: sepolia.id,
  });

  // Описание кампании
  const { data: description } = useReadContract({
    address: campaignAddr,
    abi: CrowdfundingABI,
    functionName: 'description',
    chainId: sepolia.id,
  });

  // Дедлайн кампании
  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    address: campaignAddr,
    abi: CrowdfundingABI,
    functionName: 'deadline',
    chainId: sepolia.id,
  });

  // Цель сбора
  const { data: goal, isLoading: isLoadingGoal } = useReadContract({
    address: campaignAddr,
    abi: CrowdfundingABI,
    functionName: 'goal',
    chainId: sepolia.id,
  });

  // Текущий баланс
  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    address: campaignAddr,
    abi: CrowdfundingABI,
    functionName: 'getContractBalance',
    chainId: sepolia.id,
  });

  // Уровни (tiers)
  const { data: tiers, isLoading: isLoadingTiers, refetch: refetchTiers } = useReadContract({
    address: campaignAddr,
    abi: CrowdfundingABI,
    functionName: 'getTiers',
    chainId: sepolia.id,
  });

  // Владелец кампании
  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    address: campaignAddr,
    abi: CrowdfundingABI,
    functionName: 'owner',
    chainId: sepolia.id,
  });

  // Статус кампании
  const { data: status, isLoading: isLoadingStatus } = useReadContract({
    address: campaignAddr,
    abi: CrowdfundingABI,
    functionName: 'state',
    chainId: sepolia.id,
  });

  // Конвертация даты
  const deadlineDate = deadline ? new Date(Number(deadline) * 1000) : null;
  const hasDeadlinePassed = deadlineDate ? deadlineDate < new Date() : false;

  // Расчет процента
  const balanceValue = balance ? Number(formatEther(balance)) : 0;
  const goalValue = goal ? Number(formatEther(goal)) : 1; 

  // Расчет процента
  let balancePercentage = goalValue > 0 ? (balanceValue / goalValue) * 100 : 0;
  if (balancePercentage >= 100) balancePercentage = 100;

  // Проверка на владельца
  const isOwner = owner && userAddress && owner.toLowerCase() === userAddress.toLowerCase();

  if (isLoadingName || isLoadingDeadline || isLoadingGoal || isLoadingBalance || isLoadingOwner || isLoadingStatus) {
    return (
      <div className="mx-auto max-w-7xl px-2 mt-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-12 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-24 bg-slate-700 rounded mb-4"></div>
          <div className="h-6 bg-slate-700 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-slate-700 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-2 mt-4 sm:px-6 lg:px-8">
      {/* Заголовок и кнопка редактирования */}
      <div className="flex flex-row justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-white">{name as string}</h1>
        {isOwner && (
          <div className="flex flex-row gap-2">
            {isEditing && status !== undefined && (
              <span className="px-4 py-2 bg-slate-700 text-white rounded-md">
                Status: {status === 0 ? 'Active' : status === 1 ? 'Successful' : 'Failed'}
              </span>
            )}
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Done' : 'Edit'}
            </button>
          </div>
        )}
      </div>

      {/* Описание */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
        <p className="text-slate-300">{description as string || 'No description'}</p>
      </div>

      {/* Дедлайн */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-2">Deadline</h2>
        <p className="text-slate-300">{deadlineDate?.toDateString() || 'No deadline'}</p>
      </div>

      {/* Прогресс-бар */}
      {!isLoadingBalance && !isLoadingGoal && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">
            Campaign Goal: {goalValue?.toString()} ETH
          </h2>
          <div className="relative w-full h-8 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"style={{ width: `${balancePercentage}%` }}/>
             <div className="absolute inset-0 flex items-center justify-between px-4">
              <span className="text-white text-sm font-medium">
               {balanceValue?.toString()} ETH
              </span>
              {balancePercentage < 100 && (
               <span className="text-white text-sm font-medium">
                {balancePercentage.toFixed(1)}%
               </span>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Уровни */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Funding Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingTiers ? (
            <p className="text-slate-400">Loading tiers...</p>
          ) : (
            <>
              {tiers && (tiers as any[]).length > 0 ? (
                (tiers as any[]).map((tier, index) => (
                  <TierCard
                    key={index}
                    tier={tier}
                    index={index}
                    campaignAddress={campaignAddr}
                    isEditing={isEditing}
                  />
                ))
              ) : (
                !isEditing && <p className="text-slate-400">No tiers available</p>
              )}
              {isEditing && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="h-64 flex flex-col items-center justify-center gap-2 p-6 bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-xl text-white hover:border-blue-500 hover:bg-slate-800 transition-all group"
                >
                  <span className="text-4xl text-slate-400 group-hover:text-blue-400">+</span>
                  <span className="text-lg font-medium text-slate-400 group-hover:text-blue-400">Add New Tier</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Модальное окно создания уровня */}
      {isModalOpen && (
        <CreateTierModal
          setIsModalOpen={setIsModalOpen}
          campaignAddress={campaignAddr}
          onTierAdded={refetchTiers}
        />
      )}
    </div>
  );
}