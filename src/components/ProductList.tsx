// Fetches and displays a list of products from the Fake Store API
//Products should be displayed in a visually structured layout.
//The user can filter products by category using a dropdown menu.
//The selected category should be reflected in the URL query parameters.

import { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Container, Row, Col, Card, Spinner, Badge, Alert } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import type { Product } from '../types/products';
import { useImageFallback } from '../hooks/useImageFallback';
import AddToCartButton from './AddToCartButton';


const fetchProducts = async (category?: string): Promise<Product[]> => {
  const url = category && category !== 'all'
    ? `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`
    : 'https://fakestoreapi.com/products';
  const { data } = await axios.get<Product[]>(url);
  return data;
};

function ProductList() {
  const [addedMessage, setAddedMessage] = useState<string | null>(null);
  const { handleImageError, hasFailed } = useImageFallback();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('category') || undefined;

  const { data: products, isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ['products', category ?? 'all'],
    queryFn: () => fetchProducts(category),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) return <Spinner animation="border" variant="primary" />;
  if (isError) return <p>Error: {error?.message || 'Failed to load products'}</p>;

  return (
    <Container className="py-5">
      <h2 className="mb-4 text-center fw-bold">Our Collection of Items</h2>
      {addedMessage && <Alert variant="success">{addedMessage}</Alert>}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products?.map((product) => (
          <Col key={product.id}>
            <Card className="h-100 shadow-sm border-0">
              <Link to={`/products/${product.id}`} className="text-decoration-none">
                <div
                  className="p-3 bg-light"
                  style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <img
                    src={hasFailed(product.id) ? 'https://via.placeholder.com/200x200?text=Image+Not+Available' : product.image}
                    alt={product.title}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    onError={() => handleImageError(product.id)}
                  />
                </div>
              </Link>
              <Card.Body className="d-flex flex-column">
                <Badge bg="secondary" className="mb-2 align-self-start text-capitalize">
                  {product.category}
                </Badge>
                <Card.Title className="fs-6 fw-bold" title={product.title}>
                  {product.title}
                </Card.Title>
                <Card.Text className="text-muted small mb-2 text-truncate" title={product.description}>
                  {product.description}
                </Card.Text>
                <Card.Text className="text-success fw-bold fs-5 mb-1">${product.price}</Card.Text>
                <Card.Text className="text-warning small mb-3">Rating: {product.rating?.rate ?? 'N/A'}</Card.Text>

                <div className="mt-auto">
                  <AddToCartButton
                    product={product}
                    onMessage={(message) => { setAddedMessage(message); setTimeout(() => setAddedMessage(null), 2500); }}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProductList;