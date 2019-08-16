import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const DUMMY_API = 'https://jsonplaceholder.typicode.com/posts';

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

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
