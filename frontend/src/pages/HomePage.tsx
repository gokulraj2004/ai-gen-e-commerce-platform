import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="mb-4 text-4xl font-bold text-gray-900">
        Welcome to the App
      </h1>
      <p className="mb-8 max-w-md text-lg text-gray-600">
        A full-stack application scaffold with authentication, CRUD examples, and
        modern tooling.
      </p>
      {isAuthenticated ? (
        <Link to="/items">
          <Button variant="primary" size="lg">
            View Items
          </Button>
        </Link>
      ) : (
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost" size="lg">
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;