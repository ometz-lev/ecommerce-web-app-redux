//Displays detailed information about a specific product when a user clicks the image 
// of the product from the ProductList page.
// Button to add the product to the cart

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Badge, Alert } from 'react-bootstrap';
import type { Product } from '../types/products';
import { useImageFallback } from '../hooks/useImageFallback';
import AddToCartButton from './AddToCartButton';

type ResponseVariant = 'success' | 'danger' | 'warning';

type ResponseState = {
  show: boolean;
  message: string;
  variant: ResponseVariant;
};

const ProductDetails = () => {
  const { productId } = useParams();
  const { handleImageError, hasFailed } = useImageFallback();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showResponse, setShowResponse] = useState<ResponseState>({
    show: false,
    message: '',
    variant: 'success'
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Product>(`https://fakestoreapi.com/products/${productId}`);
        setProduct(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load product details.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const triggerResponse = (msg: string, variant: ResponseVariant = 'success') => {
    setShowResponse({ show: true, message: msg, variant });
    setTimeout(() => setShowResponse({ show: false, message: '', variant: 'success' }), 3000);
  };

  if (loading) return <Container className="text-center py-5"><Spinner animation="border" variant="primary" /></Container>;
  if (error) return <Container className="text-center py-5"><p className="text-danger">Error: {error}</p></Container>;
  if (!product) return <Container className="text-center py-5"><p>Product not found</p></Container>;

  return (
    <Container className="py-5">
      {/* Display success/error message at the top of the page */}
      {showResponse.show && (
        <Alert 
          variant={showResponse.variant} 
          className="position-fixed top-0 start-50 translate-middle-x mt-3 shadow" 
          style={{ zIndex: 9999 }}
        >
          {showResponse.message}
        </Alert>
      )}

      <Row className="flex-column flex-md-row">
        <Col xs={12} md={6} className="mb-4 mb-md-0 d-flex align-items-center justify-content-center">
          <img 
            src={hasFailed(product.id) ? 'https://via.placeholder.com/400x400?text=Image+Not+Available' : product.image} 
            alt={product.title}
            style={{ maxHeight: '400px', maxWidth: '100%', objectFit: 'contain' }}
            onError={() => handleImageError(product.id)}
          />
        </Col>
        
        <Col xs={12} md={6}>
          <Card.Body className="d-flex flex-column h-100">
            <Badge bg="secondary" className="mb-2 align-self-start text-capitalize">
              {product.category}
            </Badge>
            <Card.Title className="fs-3 fw-bold mb-3">{product.title}</Card.Title>
            <Card.Text className="text-success fw-bold fs-4 mb-3">
              ${product.price}
            </Card.Text>
            <Card.Text className="mb-3 text-muted">{product.description}</Card.Text>
            
            <div className="d-flex flex-column flex-sm-row gap-2 mt-2">
              <AddToCartButton
                product={product}
                className="flex-fill"
                onMessage={(message) => triggerResponse(message)}
              />
            </div>
          </Card.Body>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;