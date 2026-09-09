import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, ButtonGroup, Spinner } from 'react-bootstrap';
import axios from 'axios';

const fetchCategories = async (): Promise<string[]> => {
  try {
    const { data } = await axios.get<string[]>('https://fakestoreapi.com/products/categories');
    return ['all', ...data];
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return ['all'];
  }
};

const CategoryFilter: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch categories on component mount
  //Falls to "All" if the API call fails
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await fetchCategories();
      setCategories(cats);
      setLoading(false);
    };
    loadCategories();
  }, []);

  const params = new URLSearchParams(location.search);
  const currentCategory = params.get('category') || 'all';

  const handleCategoryChange = (category: string) => {
    if (category === 'all') {
      navigate('/products');
    } else {
      navigate(`/products?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="mb-4 d-flex flex-wrap gap-2 justify-content-center">
      <h6 className="w-100 text-center fw-bold mb-3">Filter by Category</h6>
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <ButtonGroup role="group">
          {categories.map((category) => (
            <Button
              key={category}
              variant={currentCategory === category ? 'primary' : 'outline-primary'}
              onClick={() => handleCategoryChange(category)}
              className="text-capitalize"
            >
              {category}
            </Button>
          ))}
        </ButtonGroup>
      )}
    </div>
  );
};

export default CategoryFilter;
