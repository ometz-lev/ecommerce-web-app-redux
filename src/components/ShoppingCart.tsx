import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Card, Form, Modal, Row, Col } from 'react-bootstrap';
import type { RootState } from '../store';
import { removeFromCart, updateCount, clearCart } from '../store/cartSlice';
import { useImageFallback } from '../hooks/useImageFallback';

const ShoppingCart: React.FC = () => {
  const items = useSelector((s: RootState) => s.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleImageError, hasFailed } = useImageFallback();

  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [showClearCartModal, setShowClearCartModal] = useState(false);

  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null;

  const handleRemoveClick = (id: number) => {
    setSelectedItemId(id);
  };

  const confirmRemove = () => {
    if (selectedItemId !== null) {
      dispatch(removeFromCart(selectedItemId));
      setSelectedItemId(null);
    }
  };

  const adjustQuantity = (id: number, change: number) => {
    const currentItem = items.find((item) => item.id === id);
    if (!currentItem) return;

    const nextQty = Math.max(1, currentItem.count + change);
    dispatch(updateCount({ id, count: nextQty }));
  };

  const handleChange = (id: number, value: string) => {
    const count = parseInt(value, 10) || 1;
    dispatch(updateCount({ id, count: Math.max(1, count) }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setShowClearCartModal(false);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.count, 0).toFixed(2);

  return (
    <Container className="py-4">
      <h3 className="mb-4 fw-bold">Shopping Cart</h3>

      {items.length === 0 ? (
        <Card className="text-center py-5 shadow-sm border-0">
          <Card.Body>
            <p className="mb-0 fs-5 text-muted">Your cart is empty.</p>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4 align-items-start">
          <Col lg={8}>
            {items.map((item) => {
              const itemTotal = (item.price * item.count).toFixed(2);

              return (
                <Card key={item.id} className="mb-3 border-0 shadow-sm">
                  <Card.Body className="d-flex gap-3 align-items-center p-3 p-md-4">
                    <img
                      src={hasFailed(item.id) ? 'https://via.placeholder.com/90x90?text=No+Image' : item.image}
                      alt={item.title}
                      style={{ width: 90, height: 90, objectFit: 'contain' }}
                      className="rounded bg-light p-2"
                      onError={() => handleImageError(item.id)}
                    />

                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                        <div>
                          <h6 className="mb-1 fw-bold">{item.title}</h6>
                          <div className="text-success fw-bold">${item.price}</div>
                        </div>

                        <strong className="fs-6">Subtotal: ${itemTotal}</strong>
                      </div>

                      <div className="d-flex align-items-center gap-3 flex-wrap mt-3">
                        <div className="d-flex align-items-center border rounded-pill overflow-hidden shadow-sm bg-light">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => adjustQuantity(item.id, -1)}
                            className="rounded-0 border-0 px-2 py-1"
                            style={{ minWidth: '36px' }}
                          >
                            −
                          </Button>

                          <Form.Control
                            className="text-center border-0 bg-transparent p-0"
                            style={{ width: 52, boxShadow: 'none' }}
                            type="number"
                            min={1}
                            value={item.count}
                            onChange={(e) => handleChange(item.id, e.target.value)}
                          />

                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => adjustQuantity(item.id, 1)}
                            className="rounded-0 border-0 px-2 py-1"
                            style={{ minWidth: '36px' }}
                          >
                            +
                          </Button>
                        </div>

                        <Button variant="outline-danger" size="sm" onClick={() => handleRemoveClick(item.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </Col>

          <Col lg={4}>
            <Card className="shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <h5 className="mb-3 fw-bold">Order Summary</h5>
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Items</span>
                  <span>{items.reduce((sum, item) => sum + item.count, 0)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-muted">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 fw-bold">Total</h5>
                  <h5 className="mb-0 text-success fw-bold">${total}</h5>
                </div>

                <div className="d-grid gap-2">
                  <Button variant="primary" size="lg" className="w-100" onClick={() => navigate('/checkout')}>
                    Checkout
                  </Button>
                  <Button variant="outline-secondary" onClick={() => setShowClearCartModal(true)} className="w-100">
                    Clear Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Modal show={selectedItemId !== null} onHide={() => setSelectedItemId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Remove item?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem ? `Are you sure you want to remove "${selectedItem.title}" from your cart?` : 'Are you sure you want to remove this product from your cart?'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedItemId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmRemove}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showClearCartModal} onHide={() => setShowClearCartModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Clear cart?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This will remove all products from your cart. Continue?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowClearCartModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleClearCart}>
            Clear Cart
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ShoppingCart;
