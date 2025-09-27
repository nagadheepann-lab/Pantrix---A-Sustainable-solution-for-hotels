import React from 'react';
import { InventoryItem as InventoryItemType } from '../types';
import { ChartBarIcon, CalendarIcon, InfoIcon, SparklesIcon, TrashIcon, TrophyIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
    totalItems: number;
    expiringSoonCount: number;
    expiredCount: number;
    priorityItems: InventoryItemType[];
    onGetRecipes: (item: InventoryItemType) => void;
    onDeleteItem: (id: string) => void;
}

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; colorClass: string }> = ({ title, value, icon, colorClass }) => (
    <div className={`bg-light-bg p-6 rounded-xl shadow-lg border-2 ${colorClass} flex items-start gap-4`}>
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <p className="text-sm text-text-dark">{title}</p>
            <p className="text-3xl font-bold text-text-light">{value}</p>
        </div>
    </div>
);

const PriorityItemCard: React.FC<{ item: InventoryItemType; onGetRecipes: () => void; onDelete: () => void; }> = ({ item, onGetRecipes, onDelete }) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const expiry = new Date(item.expiryDate);
    const daysLeft = Math.round((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return (
         <div className="bg-light-bg p-4 rounded-lg border border-border-color flex items-center justify-between gap-4">
            <div>
                <h4 className="font-bold text-text-light capitalize">{item.name}</h4>
                 <p className={`text-sm ${daysLeft <= 0 ? 'text-danger' : 'text-warning'}`}>
                    {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)} days ago` : daysLeft === 0 ? 'Expires today' : `Expires in ${daysLeft} days`}
                </p>
            </div>
            <div className="flex gap-2">
                 <button onClick={onGetRecipes} className="bg-dark-bg text-text-light p-2 rounded-lg hover:bg-border-color transition-colors" title="Get Recipes">
                    <SparklesIcon className="w-5 h-5"/>
                </button>
                <button onClick={onDelete} className="bg-danger/20 text-danger p-2 rounded-lg hover:bg-danger/40 hover:text-white transition-colors" title="Delete Item">
                    <TrashIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    );
};

const Dashboard: React.FC<DashboardProps> = ({ totalItems, expiringSoonCount, expiredCount, priorityItems, onGetRecipes, onDeleteItem }) => {
    const { t } = useLanguage();
    
    return (
        <div className="space-y-8">
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title={t('dashboard.total_items')} value={totalItems} icon={<ChartBarIcon className="w-8 h-8 text-secondary" />} colorClass="border-border-color" />
                <StatCard title={t('dashboard.expiring_soon')} value={expiringSoonCount} icon={<CalendarIcon className="w-8 h-8 text-warning" />} colorClass="border-warning/50" />
                <StatCard title={t('dashboard.expired_items')} value={expiredCount} icon={<InfoIcon className="w-8 h-8 text-danger" />} colorClass="border-danger/50" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Priority Items */}
                <div className="lg:col-span-2 space-y-4">
                     <h2 className="text-2xl font-bold text-text-light border-b-2 border-primary/50 pb-2">{t('dashboard.priority_items')}</h2>
                     {priorityItems.length > 0 ? (
                        <div className="space-y-3">
                            {priorityItems.map(item => (
                                <PriorityItemCard 
                                    key={item.id} 
                                    item={item}
                                    onGetRecipes={() => onGetRecipes(item)}
                                    onDelete={() => onDeleteItem(item.id)}
                                />
                            ))}
                        </div>
                     ) : (
                        <div className="text-center py-10 px-4 bg-light-bg rounded-lg flex flex-col items-center border border-border-color">
                            <InfoIcon className="w-8 h-8 text-secondary mb-3"/>
                            <p className="text-text-dark">{t('dashboard.priority_empty')}</p>
                        </div>
                     )}
                </div>

                {/* Waste Reduction Tracker */}
                <div className="lg:sticky lg:top-24 bg-light-bg p-6 rounded-xl shadow-lg border border-border-color">
                    <div className="flex items-start gap-4">
                        <TrophyIcon className="w-8 h-8 text-accent flex-shrink-0" />
                        <div>
                             <h3 className="text-xl font-bold text-text-light">{t('dashboard.tracker_title')}</h3>
                            <p className="text-text-dark mt-1">{t('dashboard.tracker_desc', { count: 5 })}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
