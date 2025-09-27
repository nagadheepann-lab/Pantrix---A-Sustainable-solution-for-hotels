import React, { useState, useMemo } from 'react';
import { DonationRequest } from '../types';
import { InfoIcon, TruckIcon, CheckCircleIcon, XCircleIcon, UsersIcon } from './icons';
import Modal from './Modal';
import DonationDetailModal from './DonationDetailModal';
import { useLanguage } from '../contexts/LanguageContext';
import RestaurantDetailModal from './RestaurantDetailModal';

interface FoodBankDashboardProps {
    requests: DonationRequest[];
    onAccept: (id: string) => void;
    onDecline: (id: string) => void;
    onComplete: (id: string) => void;
}

type View = 'pending' | 'active';

interface PartnerInfo {
    name: string;
    location: string;
}

const FoodBankDashboard: React.FC<FoodBankDashboardProps> = ({ requests, onAccept, onDecline, onComplete }) => {
    const { t } = useLanguage();
    const [view, setView] = useState<View>('pending');
    const [selectedRequest, setSelectedRequest] = useState<DonationRequest | null>(null);
    const [selectedPartner, setSelectedPartner] = useState<PartnerInfo | null>(null);

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const activeShipments = requests.filter(r => r.status === 'accepted' || r.status === 'completed');

    const restaurantPartners = useMemo(() => {
        const partners = new Map<string, PartnerInfo>();
        requests.forEach(req => {
            if (!partners.has(req.restaurantName)) {
                partners.set(req.restaurantName, { name: req.restaurantName, location: req.location });
            }
        });
        return Array.from(partners.values());
    }, [requests]);
    
    const completedDonationsForPartner = useMemo(() => {
        if (!selectedPartner) return [];
        return requests
            .filter(r => r.restaurantName === selectedPartner.name && r.status === 'completed')
            .sort((a, b) => new Date(b.donationDate!).getTime() - new Date(a.donationDate!).getTime());
    }, [requests, selectedPartner]);


    const renderRequestCard = (request: DonationRequest) => (
        <div key={request.id} className="bg-light-bg p-4 rounded-lg border border-border-color flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg text-text-light">{request.restaurantName}</h3>
                        <p className="text-sm text-text-dark">{request.location}</p>
                        <p className="text-sm text-text-dark mt-1">{request.items.length} item types</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize 
                        ${request.status === 'pending' ? 'bg-warning/20 text-warning' : ''}
                        ${request.status === 'accepted' ? 'bg-secondary/20 text-secondary' : ''}
                        ${request.status === 'completed' ? 'bg-success/20 text-success' : ''}
                    `}>
                        {request.status}
                    </span>
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <button onClick={() => setSelectedRequest(request)} className="flex-1 bg-dark-bg text-text-light font-semibold py-2 px-3 rounded-md hover:bg-border-color transition-colors">View Details</button>
                {request.status === 'pending' && (
                    <>
                        <button onClick={() => onDecline(request.id)} className="bg-danger/20 text-danger p-2 rounded-md hover:bg-danger/40 transition-colors" title="Decline"><XCircleIcon /></button>
                        <button onClick={() => onAccept(request.id)} className="bg-success/20 text-success p-2 rounded-md hover:bg-success/40 transition-colors" title="Accept"><CheckCircleIcon /></button>
                    </>
                )}
                {request.status === 'accepted' && (
                    <button onClick={() => onComplete(request.id)} className="flex-1 bg-success text-white font-bold py-2 px-3 rounded-md hover:bg-green-600 transition-colors">Mark as Received</button>
                )}
            </div>
        </div>
    );
    
    const NavButton: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => {
        const activeClasses = "bg-primary text-white";
        const inactiveClasses = "bg-light-bg text-text-light hover:bg-border-color";
        return <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-full transition-colors ${active ? activeClasses : inactiveClasses}`}>{children}</button>
    }

    return (
        <div className="space-y-8">
            <div className="bg-dark-bg/50 p-2 rounded-full flex gap-2 max-w-md mx-auto border border-border-color">
                <NavButton active={view === 'pending'} onClick={() => setView('pending')}>
                    <InfoIcon /> {t('foodBank.pending_requests')}
                </NavButton>
                <NavButton active={view === 'active'} onClick={() => setView('active')}>
                    <TruckIcon /> {t('foodBank.active_shipments')}
                </NavButton>
            </div>
            
            <div>
                {view === 'pending' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pendingRequests.length > 0 ? pendingRequests.map(renderRequestCard) : <p className="text-text-dark col-span-full text-center py-10">{t('foodBank.no_pending')}</p>}
                    </div>
                )}
                 {view === 'active' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeShipments.length > 0 ? activeShipments.map(renderRequestCard) : <p className="text-text-dark col-span-full text-center py-10">{t('foodBank.no_active')}</p>}
                    </div>
                )}
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-text-light border-b-2 border-primary/50 pb-2 mb-4 flex items-center gap-3">
                    <UsersIcon />
                    {t('foodBank.partners_header')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {restaurantPartners.map(partner => (
                        <button 
                            key={partner.name} 
                            onClick={() => setSelectedPartner(partner)}
                            className="bg-light-bg p-4 rounded-lg border border-border-color text-left transform transition-transform hover:-translate-y-1 w-full"
                        >
                            <p className="font-semibold text-text-light">{partner.name}</p>
                            <p className="text-xs text-text-dark">{partner.location}</p>
                        </button>
                    ))}
                </div>
            </div>

            {selectedRequest && (
                <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title={`${t('foodBank.donation_from')} ${selectedRequest.restaurantName}`}>
                    <DonationDetailModal request={selectedRequest} />
                </Modal>
            )}

            {selectedPartner && (
                <Modal isOpen={!!selectedPartner} onClose={() => setSelectedPartner(null)} title={t('foodBank.partner_details_title')}>
                    <RestaurantDetailModal 
                        partner={selectedPartner}
                        donationHistory={completedDonationsForPartner}
                    />
                </Modal>
            )}

        </div>
    );
};

export default FoodBankDashboard;