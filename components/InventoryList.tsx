
import React from 'react';
import { InventoryItem as InventoryItemType } from '../types';
import InventoryItem from './InventoryItem';
import { InfoIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface InventoryListProps {
    items: InventoryItemType[];
    onDeleteItem: (id: string) => void;
    onGetRecipes: (item: InventoryItemType) => void;
    showRecipeButton?: boolean;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onDeleteItem, onGetRecipes, showRecipeButton = true }) => {
    const { t } = useLanguage();

    if (items.length === 0) {
        return (
            <div className="text-center py-20 px-6 bg-light-bg rounded-xl shadow-lg flex flex-col items-center border border-border-color">
                 <InfoIcon className="w-12 h-12 text-secondary mb-4"/>
                <h2 className="text-2xl font-bold text-text-light mb-2">{t('inventory.empty_title')}</h2>
                <p className="text-text-dark max-w-md">
                    {t('inventory.empty_desc')}
                </p>
            </div>
        );
    }
    
    const sortedItems = [...items].sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedItems.map(item => (
                <InventoryItem
                    key={item.id}
                    item={item}
                    onDeleteItem={onDeleteItem}
                    onGetRecipes={onGetRecipes}
                    showRecipeButton={showRecipeButton}
                />
            ))}
        </div>
    );
};

export default InventoryList;
