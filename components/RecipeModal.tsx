import React from 'react';
import { Recipe } from '../types';
import { AlertTriangleIcon, SparklesIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface RecipeModalProps {
    isLoading: boolean;
    recipes: Recipe[];
    error: string | null;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-dark-bg/50 p-4 rounded-lg">
                <div className="h-4 bg-border-color rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-border-color rounded w-full"></div>
                <div className="h-3 bg-border-color rounded w-5/6 mt-1"></div>
            </div>
        ))}
    </div>
);

const RecipeModal: React.FC<RecipeModalProps> = ({ isLoading, recipes, error }) => {
    const { t } = useLanguage();

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center text-center text-danger">
                <AlertTriangleIcon className="w-10 h-10 mb-3" />
                <p className="font-semibold">Oops! Something went wrong.</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="text-center text-text-dark">
                {t('recipeModal.no_recipes')}
            </div>
        );
    }

    return (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
            {recipes.map((recipe, index) => (
                <div key={index} className="bg-dark-bg p-4 rounded-lg border border-border-color">
                    <h4 className="font-bold text-primary text-lg flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-accent" />
                        {recipe.name}
                    </h4>
                    <p className="text-text-dark text-sm mt-1">{recipe.description}</p>
                    
                    <div className="mt-4">
                        <h5 className="font-semibold text-text-light mb-2">{t('recipeModal.ingredients')}</h5>
                        <ul className="list-disc list-inside text-text-dark text-sm space-y-1 pl-2">
                            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                        </ul>
                    </div>

                     <div className="mt-4">
                        <h5 className="font-semibold text-text-light mb-2">{t('recipeModal.instructions')}</h5>
                        <ol className="list-decimal list-inside text-text-dark text-sm space-y-2 pl-2">
                            {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                        </ol>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RecipeModal;
