//This component is used to clear the category filter and reset the product list to show all products.

import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ClearFilter: React.FC = () => {
    const navigate = useNavigate();

    const handleClearFilter = () => {
        navigate('/products');
    };

    return (
        <Button variant="outline-secondary" onClick={handleClearFilter}>
            Clear Filter
        </Button>
    );
};

export default ClearFilter;