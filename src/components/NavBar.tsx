// React bootstrap components for the navigation bar
//Navigation Bar component with links to Home, Product Listing, and Add Product pages
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar, Nav, Container, Form, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import ClearFilter from './ClearFilter';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useSelector((state: RootState) => state.cart.items.reduce((sum, item) => sum + item.count, 0));

  const fetchCategories = async (): Promise<string[]> => {
    const { data } = await axios.get<string[]>('https://fakestoreapi.com/products/categories');
    return data;
  };

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(location.search);
    if (value === 'all') params.delete('category');
    else params.set('category', value);
    navigate({ pathname: '/products', search: params.toString() });
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Form.Select
          aria-label="Select category"
          onChange={handleCategoryChange}
          className="me-3 w-auto"
          defaultValue="all"
        >
          <option value="all">All Categories</option>
          {isLoading ? (
            <option disabled>Loading...</option>
          ) : (
            categories.map((c) => (
              <option key={c} value={c} className="text-capitalize">
                {c}
              </option>
            ))
          )}
        </Form.Select>

        {/* ClearFilter component to reset the category filter */}
        <div className="me-5">
          <ClearFilter />
        </div>

        <Navbar.Brand as={Link} to="/" className="navbar-brand ms-auto">
          TRENDSETTERS FAKESTORE
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products">
              Products
            </Nav.Link>
            {/*<Nav.Link as={Link} to="/products/add">
              Add Products
            </Nav.Link>
            <Nav.Link as={Link} to="/cart">
              Cart
            </Nav.Link>*/}
            <Nav.Link as={Link} to="/cart" className="d-flex align-items-center">
              <span style={{ fontSize: '1.2rem' }} aria-hidden>🛒</span>
              {cartCount > 0 ? (
                <Badge bg="danger" pill className="ms-2">
                  {cartCount}
                </Badge>
              ) : null}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
