import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ fetchAndFormatIngredients, onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('');

  useEffect(() => {
    const setFilteredIngredients = async () => {
      const ingredients = await fetchAndFormatIngredients();
      const filteredIngredients = filterIngredientsByTitle(ingredients);
      onLoadIngredients(filteredIngredients);
    };

    setFilteredIngredients();
  }, [enteredFilter, onLoadIngredients]);

  const filterIngredientsByTitle = ingredients => {
    if (enteredFilter) {
      return ingredients.filter(ingredient => ingredient.title === enteredFilter);
    }
    return ingredients;
  };

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
