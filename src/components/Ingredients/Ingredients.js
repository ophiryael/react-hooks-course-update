import React, { useState, useEffect, useCallback } from 'react';

import { DUMMY_API_URL } from '../../dummayApi';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS');
  }, [userIngredients]);

  const addIngredientHandler = async ingredient => {
    setIsLoading(true);

    try {
      await fetch(DUMMY_API_URL, {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Ingredient added successfully', ingredient);

      setUserIngredients(prevIngredients => [
        ...prevIngredients,
        { id: Math.random().toString(), ...ingredient }
      ]);
    } catch (error) {
      setError('Something went wrong!');
      console.log('Adding ingredient failed', { ingredient, error });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const removeIngredientHandler = async ingredientId => {
    setIsLoading(true);

    try {
      await fetch(`${DUMMY_API_URL}/${ingredientId}`, { method: 'DELETE' });
      console.log('Deleted ingredient successfully', { ingredientId });

      setUserIngredients(prevIngredients => {
        return prevIngredients.filter(ingredient => ingredient.id !== ingredientId);
      });
    } catch (error) {
      setError('Something went wrong!');
      console.log('Ingredient deletion failed', { ingredientId });
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
