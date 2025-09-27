import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { InventoryItem as InventoryItemType, DonationRequest, Recipe } from './types';
import { getRecipeSuggestions, getSmartRecipes } from './services/geminiService';
import Header from './components/Header';
import InventoryList from './components/InventoryList';
import Modal from './components/Modal';
import AddItemForm from './components/AddItemForm';
import RecipeModal from './components/RecipeModal';
import Welcome from './components/Welcome';
import PublicLogin from './components/PublicLogin';
import HotelLogin from './components/HotelLogin';
import HotelPantry from './components/HotelPantry';
import Dashboard from './components/Dashboard';
import PublicNav from './components/PublicNav';
import HotelNav from './components/HotelNav';
import FoodBankLogin from './components/FoodBankLogin';
import FoodBankDashboard from './components/FoodBankDashboard';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import SettingsModal from './components/SettingsModal';
import ProfileModal from './components/ProfileModal';

type Page = 'welcome' | 'public-login' | 'hotel-login' | 'food-bank-login' | 'pantry' | 'hotel-pantry' | 'food-bank-dashboard';
type UserType = 'public' | 'hotel' | 'food-bank' | null;
type PublicView = 'dashboard' | 'inventory';
type HotelView = 'dashboard' | 'inventory';

const initialDonationRequests: DonationRequest[] = [
    { id: 'don-16222', restaurantName: 'The Grand Eatery', location: 'New York, USA', items: [{ id: 'd1-1', name: 'Potatoes', expiryDate: '2024-07-20', quantity: '20 lbs', category: 'Produce' }, { id: 'd1-2', name: 'Onions', expiryDate: '2024-07-25', quantity: '10 lbs', category: 'Produce' }], status: 'pending' },
    { id: 'don-16333', restaurantName: 'Sunset Bistro', location: 'Los Angeles, USA', items: [{ id: 'd2-1', name: 'Chicken Breast', expiryDate: '2024-07-18', quantity: '30 lbs', category: 'Meat' }], status: 'pending' },
    { id: 'don-16444', restaurantName: 'The Grand Eatery', location: 'New York, USA', items: [{ id: 'd3-1', name: 'Milk', expiryDate: '2024-05-15', quantity: '10 Gallons', category: 'Dairy' }], status: 'completed', donationDate: '2024-05-10' },
    { id: 'don-16555', restaurantName: 'Ocean\'s Catch', location: 'Miami, USA', items: [{ id: 'd4-1', name: 'Fish Fillets', expiryDate: '2024-07-19', quantity: '15 lbs', category: 'Meat' }], status: 'accepted' },
    { id: 'don-16666', restaurantName: 'The Grand Eatery', location: 'New York, USA', items: [{ id: 'd5-1', name: 'Bread', expiryDate: '2024-04-25', quantity: '15 Loaves', category: 'Bakery' }, { id: 'd5-2', name: 'Cheese', expiryDate: '2024-05-10', quantity: '5 lbs', category: 'Dairy' }], status: 'completed', donationDate: '2024-04-22' },
    { id: 'don-16777', restaurantName: 'Sunset Bistro', location: 'Los Angeles, USA', items: [{ id: 'd6-1', name: 'Tomatoes', expiryDate: '2024-05-05', quantity: '25 lbs', category: 'Produce' }], status: 'completed', donationDate: '2024-05-01' },
    { id: 'don-16888', restaurantName: 'Mountain View Grill', location: 'Denver, USA', items: [{ id: 'd7-1', name: 'Steak', expiryDate: '2024-07-17', quantity: '40 lbs', category: 'Meat' }], status: 'pending' }
];

const AppContent: React.FC = () => {
    const { t } = useLanguage();
    // Routing and user state
    const [currentPage, setCurrentPage] = useState<Page>('welcome');
    const [userType, setUserType] = useState<UserType>(null);
    const [restaurantDetails, setRestaurantDetails] = useState({ name: '', location: '' });

    // View state
    const [publicView, setPublicView] = useState<PublicView>('dashboard');
    const [hotelView, setHotelView] = useState<HotelView>('dashboard');

    // Shared state
    const [inventory, setInventory] = useState<InventoryItemType[]>([]);
    const [donationRequests, setDonationRequests] = useState<DonationRequest[]>(initialDonationRequests);
    
    // UI Modals state
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isRecipeModalOpen, setRecipeModalOpen] = useState(false);
    const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItemType | null>(null);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Hotel user state
    const [smartRecipes, setSmartRecipes] = useState<Recipe[]>([]);
    const [isLoadingSmartRecipes, setIsLoadingSmartRecipes] = useState(false);


    // Data loading effect
    useEffect(() => {
        if (currentPage === 'pantry' || currentPage === 'hotel-pantry' || currentPage === 'food-bank-dashboard') {
            const initialItems: InventoryItemType[] = [
                 { id: '3', name: 'Bread', expiryDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], quantity: userType === 'hotel' ? '20 Loaves' : '1 Loaf', category: 'Bakery' },
                 { id: '20', name: 'Avocadoes', expiryDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], quantity: userType === 'hotel' ? '40 units': '2 units', category: 'Produce' },
                { id: '4', name: 'Chicken Breast', expiryDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], quantity: userType === 'hotel' ? '50 lbs' : '1 lb', category: 'Meat' },
                { id: '31', name: 'Old Berries', expiryDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], quantity: '1 pint', category: 'Produce' },
                { id: '1', name: 'Milk', expiryDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0], quantity: userType === 'hotel' ? '12 Gallons' : '0.5 Gallon', category: 'Dairy' },
                { id: '10', name: 'Potatoes', expiryDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().split('T')[0], quantity: userType === 'hotel' ? '50 lbs bag' : '2 lbs', category: 'Produce' },
                { id: '11', name: 'Onions', expiryDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], quantity: userType === 'hotel' ? '25 lbs bag' : '1 lb', category: 'Produce' },
                { id: '2', name: 'Eggs', expiryDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0], quantity: userType === 'hotel' ? '10 Dozen' : '1 Dozen', category: 'Dairy' },
                { id: '7', name: 'Cheese', expiryDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString().split('T')[0], quantity: userType === 'hotel' ?'15 lbs' : '8 oz', category: 'Dairy' },
                { id: '5', name: 'Spinach', expiryDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], quantity: userType === 'hotel' ? '5 lbs' : '1 bag', category: 'Produce' },
                { id: '6', name: 'Tomatoes', expiryDate: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString().split('T')[0], quantity: userType === 'hotel' ? '30 lbs' : '1 lb', category: 'Produce' },
                { id: '8', name: 'Pasta', expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], quantity: userType === 'hotel' ? '20 boxes' : '1 box', category: 'Pantry' },
            ];
             setInventory(initialItems.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()));

            if (userType === 'hotel') {
                 const expiringSoon = initialItems.filter(item => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const expiry = new Date(item.expiryDate);
                    const diffTime = expiry.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    return diffDays <= 2 && diffDays >= 0;
                });
                if(expiringSoon.length > 0) {
                    handleFetchSmartRecipes(expiringSoon);
                }
            }
        }
    }, [currentPage, userType]);

    // Derived state for dashboards
    const { expiringSoonItems, bulkExpiringItems, expiredCount, expiringSoonCount, priorityItems } = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const getDaysDiff = (expiryDate: string) => {
            const expiry = new Date(expiryDate);
            const diffTime = expiry.getTime() - today.getTime();
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        };

        const expiringSoon = inventory.filter(item => {
            const diffDays = getDaysDiff(item.expiryDate);
            return diffDays <= 3 && diffDays >= 0;
        });
        
        const bulkExpiring = inventory.filter(item => {
            const diffDays = getDaysDiff(item.expiryDate);
            const quantityNum = parseFloat(item.quantity);
            return diffDays <= 7 && diffDays >= 0 && quantityNum > 10;
        });

        const expired = inventory.filter(item => getDaysDiff(item.expiryDate) < 0);

        const hotelExpiringSoon = inventory.filter(item => {
            const diffDays = getDaysDiff(item.expiryDate);
            return diffDays <= 2 && diffDays >= 0;
        });

        return {
            expiringSoonItems: hotelExpiringSoon,
            bulkExpiringItems: bulkExpiring,
            expiredCount: expired.length,
            expiringSoonCount: expiringSoon.length,
            priorityItems: expiringSoon.slice(0, 3)
        };
    }, [inventory]);


    const handleAddItem = (item: Omit<InventoryItemType, 'id'>) => {
        const newItem: InventoryItemType = {
            ...item,
            id: new Date().getTime().toString(),
        };
        setInventory(prev => [...prev, newItem].sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()));
        setAddModalOpen(false);
    };

    const handleDeleteItem = (id: string) => {
        setInventory(prev => prev.filter(item => item.id !== id));
    };

    const handleFetchRecipes = useCallback(async (item: InventoryItemType) => {
        setSelectedItem(item);
        setRecipeModalOpen(true);
        setIsLoadingRecipes(true);
        setError(null);
        setRecipes([]);
        try {
            const recipeData = await getRecipeSuggestions(item.name);
            setRecipes(recipeData);
        } catch (err) {
            setError(t('recipeModal.error'));
            console.error(err);
        } finally {
            setIsLoadingRecipes(false);
        }
    }, [t]);

    const handleFetchSmartRecipes = useCallback(async (items: InventoryItemType[]) => {
        setIsLoadingSmartRecipes(true);
        setSmartRecipes([]);
        try {
            const recipes = await getSmartRecipes(items.map(i => i.name));
            setSmartRecipes(recipes);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingSmartRecipes(false);
        }
    }, []);

    const handleCreateDonationRequest = (itemsToDonate: InventoryItemType[]) => {
        const newRequest: DonationRequest = {
            id: `don-${new Date().getTime()}`,
            restaurantName: restaurantDetails.name,
            location: restaurantDetails.location,
            items: itemsToDonate,
            status: 'pending'
        };
        setDonationRequests(prev => [...prev, newRequest]);
        setInventory(prev => prev.filter(item => !itemsToDonate.some(donated => donated.id === item.id)));
        alert('Donation request sent!');
    };
    
    const handleAcceptDonation = (id: string) => {
        setDonationRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'accepted' } : req));
    };

    const handleDeclineDonation = (id: string) => {
        setDonationRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'declined' } : req));
    };

    const handleCompleteDonation = (id: string) => {
        setDonationRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'completed', donationDate: new Date().toISOString().split('T')[0] } : req));
    };

    const handlePublicLogin = () => {
        setUserType('public');
        setPublicView('dashboard');
        setCurrentPage('pantry');
    };

    const handleHotelLogin = (name: string, location: string) => {
        setUserType('hotel');
        setRestaurantDetails({ name, location });
        setHotelView('dashboard');
        setCurrentPage('hotel-pantry');
    };
    
    const handleFoodBankLogin = () => {
        setUserType('food-bank');
        setCurrentPage('food-bank-dashboard');
    };

    const handleLogout = () => {
        setCurrentPage('welcome');
        setUserType(null);
        setInventory([]);
        setRestaurantDetails({ name: '', location: '' });
    }

    const renderPage = () => {
        const headerProps = {
            onAddItem: () => setAddModalOpen(true),
            onOpenSettings: () => setSettingsModalOpen(true),
            onOpenProfile: () => setProfileModalOpen(true),
            userType: userType,
            restaurantName: userType === 'hotel' ? restaurantDetails.name : userType === 'food-bank' ? "Food Bank Portal" : undefined
        };
        switch (currentPage) {
            case 'welcome':
                return <Welcome onSelectPublic={() => setCurrentPage('public-login')} onSelectHotel={() => setCurrentPage('hotel-login')} onSelectFoodBank={() => setCurrentPage('food-bank-login')}/>;
            case 'public-login':
                return <PublicLogin onLogin={handlePublicLogin} onBack={() => setCurrentPage('welcome')} />;
            case 'hotel-login':
                return <HotelLogin onLogin={handleHotelLogin} onBack={() => setCurrentPage('welcome')} />;
            case 'food-bank-login':
                return <FoodBankLogin onLogin={handleFoodBankLogin} onBack={() => setCurrentPage('welcome')} />;
            case 'pantry':
                return (
                    <>
                        <Header {...headerProps} />
                        <main className="container mx-auto px-4 py-8">
                            <PublicNav activeView={publicView} setView={setPublicView} />
                            <div className="mt-8">
                                {publicView === 'dashboard' ? (
                                    <Dashboard 
                                        totalItems={inventory.length}
                                        expiringSoonCount={expiringSoonCount}
                                        expiredCount={expiredCount}
                                        priorityItems={priorityItems}
                                        onGetRecipes={handleFetchRecipes}
                                        onDeleteItem={handleDeleteItem}
                                    />
                                ) : (
                                    <InventoryList
                                        items={inventory}
                                        onDeleteItem={handleDeleteItem}
                                        onGetRecipes={handleFetchRecipes}
                                    />
                                )}
                            </div>
                        </main>
                    </>
                );
             case 'hotel-pantry':
                return (
                    <>
                         <Header {...headerProps} />
                         <main className="container mx-auto px-4 py-8">
                            <HotelNav activeView={hotelView} setView={setHotelView} />
                            <div className="mt-8">
                                {hotelView === 'dashboard' ? (
                                    <HotelPantry
                                        expiringSoonItems={expiringSoonItems}
                                        bulkExpiringItems={bulkExpiringItems}
                                        smartRecipes={smartRecipes}
                                        isLoadingSmartRecipes={isLoadingSmartRecipes}
                                        onCreateDonation={handleCreateDonationRequest}
                                    />
                                ) : (
                                    <InventoryList
                                        items={inventory}
                                        onDeleteItem={handleDeleteItem}
                                        onGetRecipes={handleFetchRecipes}
                                        showRecipeButton={false}
                                    />
                                )}
                            </div>
                         </main>
                    </>
                );
            case 'food-bank-dashboard':
                return (
                     <>
                        <Header {...headerProps} />
                        <main className="container mx-auto px-4 py-8">
                            <FoodBankDashboard 
                                requests={donationRequests}
                                onAccept={handleAcceptDonation}
                                onDecline={handleDeclineDonation}
                                onComplete={handleCompleteDonation}
                            />
                        </main>
                    </>
                );
            default:
                 return <Welcome onSelectPublic={() => setCurrentPage('public-login')} onSelectHotel={() => setCurrentPage('hotel-login')} onSelectFoodBank={() => setCurrentPage('food-bank-login')} />;
        }
    };

    return (
        <div className="bg-dark-bg min-h-screen font-sans text-text-light">
             {renderPage()}

            {/* Shared Modals */}
             <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title={t('addItem.title')}>
                <AddItemForm onAddItem={handleAddItem} onCancel={() => setAddModalOpen(false)} />
            </Modal>

            {selectedItem && (
                <Modal isOpen={isRecipeModalOpen} onClose={() => setRecipeModalOpen(false)} title={`${t('recipeModal.title')} ${selectedItem.name}`}>
                    <RecipeModal
                        isLoading={isLoadingRecipes}
                        recipes={recipes}
                        error={error}
                    />
                </Modal>
            )}

            <Modal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} title={t('settings.title')}>
                <SettingsModal onClose={() => setSettingsModalOpen(false)} />
            </Modal>

            {userType && (
                 <Modal isOpen={isProfileModalOpen} onClose={() => setProfileModalOpen(false)} title={t('profile.title')}>
                    <ProfileModal 
                        onClose={() => setProfileModalOpen(false)}
                        onLogout={() => {
                            setProfileModalOpen(false);
                            handleLogout();
                        }}
                        userType={userType}
                        userName={
                            userType === 'hotel' ? restaurantDetails.name :
                            userType === 'food-bank' ? "Food Bank Portal" :
                            "Public User"
                        }
                        userEmail={
                            userType === 'hotel' ? "manager@example.com" :
                            userType === 'food-bank' ? "contact@foodbank.org" :
                            "user@example.com"
                        }
                        userLocation={userType === 'hotel' ? restaurantDetails.location : undefined}
                        itemsSaved={userType === 'public' ? 5 : undefined}
                    />
                </Modal>
            )}
        </div>
    );
};

const App: React.FC = () => (
    <LanguageProvider>
        <AppContent />
    </LanguageProvider>
);

export default App;