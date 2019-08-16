import React, { useState, useEffect, useRef } from 'react';

import { DUMMY_API_URL } from '../../dummayApi';
import Card from '../UI/Card';
import './Search.css';

const fetchAndFormatIngredients = async () => {
  const fetchedIngredients = await fetchIngredients();
  return formatFetchedIngredients(fetchedIngredients);
};

const fetchIngredients = async () => {
  try {
    const res = await fetch(DUMMY_API_URL);
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

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    const filterIngredientsByTitle = ingredients => {
      if (enteredFilter) {
        return ingredients.filter(ingredient => ingredient.title === enteredFilter);
      }
      return ingredients;
    };

    const setFilteredIngredients = async () => {
      const ingredients = await fetchAndFormatIngredients();
      const filteredIngredients = filterIngredientsByTitle(ingredients);
      onLoadIngredients(filteredIngredients);
    };

    setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        setFilteredIngredients();
      }
    }, 500);
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
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
