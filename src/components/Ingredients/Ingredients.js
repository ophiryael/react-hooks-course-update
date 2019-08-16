import React, { useState, useEffect, useCallback } from 'react';

import { DUMMY_API_URL } from '../../dummayApi';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS');
  }, [userIngredients]);

  const addIngredientHandler = async ingredient => {
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
      console.log('Adding ingredient failed', { ingredient, error });
    }
  };

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const removeIngredientHandler = async ingredientId => {
    try {
      await fetch(`${DUMMY_API_URL}/${ingredientId}`, { method: 'DELETE' });
      console.log('Deleted ingredient successfully', { ingredientId });

      setUserIngredients(prevIngredients => {
        return prevIngredients.filter(ingredient => ingredient.id !== ingredientId);
      });
    } catch (error) {
      console.log('Ingredient deletion failed', { ingredientId });
    }
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
