import ProductSkeleton from '../../../components/Skeleton/ProductSkeleton';
import React from 'react';

const loading = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} />
            ))}
            
        </div>
    );
};

export default loading;