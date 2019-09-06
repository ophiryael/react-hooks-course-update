import React, { useState, useEffect, useRef } from 'react';
import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';
import { DUMMY_API_URL } from '../../dummayApi';
import './Search.css';

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

const filterIngredientsByTitle = (ingredients, enteredFilter) => {
  if (enteredFilter) {
    return ingredients.filter(ingredient => ingredient.title === enteredFilter);
  }
  return ingredients;
};

const Search = React.memo(({ onLoadIngredients }) => {
  const [enteredFilter, setEnteredFilter] = useState('');
  const inputRef = useRef();
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        sendRequest(DUMMY_API_URL, 'GET');
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const formattedFetchedIngredients = formatFetchedIngredients(data);
      const filteredIngredients = filterIngredientsByTitle(formattedFetchedIngredients, enteredFilter);
      onLoadIngredients(filteredIngredients);
    }
  }, [data, isLoading, error, onLoadIngredients, enteredFilter]);

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>}
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
