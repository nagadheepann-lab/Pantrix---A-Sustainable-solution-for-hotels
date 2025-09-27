import React, { useState } from 'react';
import { ArrowLeftIcon, BuildingIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface HotelLoginProps {
    onLogin: (name: string, location: string) => void;
    onBack: () => void;
}

const HotelLogin: React.FC<HotelLoginProps> = ({ onLogin, onBack }) => {
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name || !location) {
            alert("Please fill in all fields.");
            return;
        }
        onLogin(name, location);
    };

    return (
        <div 
            className="min-h-screen flex flex-col justify-center items-center p-4 relative bg-dark-bg"
            style={{
                backgroundImage: 'radial-gradient(rgba(74, 85, 104, 0.5) 0.5px, transparent 0.5px)',
                backgroundSize: '2rem 2rem'
            }}
        >
             <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-text-dark hover:text-text-light transition-colors z-10">
                <ArrowLeftIcon className="w-5 h-5" />
                <span>{t('login.back')}</span>
            </button>
            <div className="w-full max-w-sm z-10">
                 <div className="text-center mb-8">
                    <div className="bg-light-bg inline-block p-4 rounded-full mb-4 border-2 border-border-color">
                        <BuildingIcon className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-text-light">{t('login.hotel_title')}</h1>
                    <p className="text-text-dark mt-1">{t('login.hotel_subtitle')}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4 bg-light-bg/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-border-color/50">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-1">{t('login.restaurant_name_label')}</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                             placeholder={t('login.restaurant_name_placeholder')}
                            className="w-full bg-dark-bg border border-border-color rounded-lg px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="location" className="block text-sm font-medium text-text-dark mb-1">{t('login.location_label')}</label>
                        <input
                            type="text"
                            id="location"
                             value={location}
                            onChange={(e) => setLocation(e.target.value)}
                             placeholder={t('login.location_placeholder')}
                            className="w-full bg-dark-bg border border-border-color rounded-lg px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1">{t('login.business_email_label')}</label>
                        <input
                            type="email"
                            id="email"
                            defaultValue="manager@example.com"
                            className="w-full bg-dark-bg border border-border-color rounded-lg px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-text-dark mb-1">{t('login.password_label')}</label>
                        <input
                            type="password"
                            id="password"
                            defaultValue="password"
                            className="w-full bg-dark-bg border border-border-color rounded-lg px-3 py-2 text-text-light focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div className="pt-4">
                         <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-hover transition-colors">
                            {t('login.login_button')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HotelLogin;
