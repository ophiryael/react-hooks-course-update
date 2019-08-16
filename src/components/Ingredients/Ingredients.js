import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const DUMMY_API = 'https://jsonplaceholder.typicode.com/albums';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    const initializeIngredients = async () => {
      const fetchedIngredients = await fetchIngredients();
      const formattedIngredients = formatFetchedIngredients(fetchedIngredients);
      setUserIngredients(formattedIngredients);
    };

    initializeIngredients();
  }, []);

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

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients => {
      return prevIngredients.filter(ingredient => ingredient.id !== ingredientId);
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
