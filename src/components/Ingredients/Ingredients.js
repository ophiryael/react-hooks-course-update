import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const DUMMY_API = 'https://jsonplaceholder.typicode.com/albums';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS');
  }, [userIngredients]);

  useEffect(() => {
    const initializeIngredients = async () => {
      const ingredients = await fetchAndFormatIngredients();
      setUserIngredients(ingredients);
    };

    initializeIngredients();
  }, []);

  const fetchAndFormatIngredients = async () => {
    const fetchedIngredients = await fetchIngredients();
    return formatFetchedIngredients(fetchedIngredients);
  };

  const fetchIngredients = async () => {
    try {
      const res = await fetch(DUMMY_API);
      console.log('Successfully fetched ingredients');
      return res.json();
    } catch (error) {
      console.log('Failed to fetch ingredients', error);
    }
  };

  const formatFetchedIngredients = fetchedIngredients => {
    return fetchedIngredients.map(ingredient => ({
      id: ingredient.id,
      title: ingredient.title,
      amount: getRandomInt()
    }));
  };

  function getRandomInt() {
    const MAX = 10;
    return Math.floor(Math.random() * Math.floor(MAX));
  }

  const addIngredientHandler = async ingredient => {
    await postIngredient(ingredient);
    setUserIngredients(prevIngredients => [
      ...prevIngredients,
      { id: Math.random().toString(), ...ingredient }
    ]);
  };

  const postIngredient = async ingredient => {
    try {
      const res = await fetch(DUMMY_API, {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Posted ingredient successfully', ingredient);
      return res.json();
    } catch (error) {
      console.log('Posting ingredient failed', error);
    }
  };

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients => {
      return prevIngredients.filter(ingredient => ingredient.id !== ingredientId);
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search
          fetchAndFormatIngredients={fetchAndFormatIngredients}
          onLoadIngredients={filteredIngredientsHandler}
        />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
