import React, { useReducer, useEffect, useCallback, useMemo } from 'react';
import { DUMMY_API_URL } from '../../dummayApi';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredient, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredient, action.ingredient];
    case 'DELETE':
      return currentIngredient.filter(ingredient => ingredient.id !== action.id);
    default:
      throw new Error('Should not get here!');
  }
};

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...currentHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return { ...currentHttpState, error: null };
    default:
      throw new Error('Should not get here!');
  }
};

function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });
  // const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS');
  }, [userIngredients]);

  const addIngredientHandler = useCallback(async ingredient => {
    dispatchHttp({ type: 'SEND' });

    try {
      await fetch(DUMMY_API_URL, {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Ingredient added successfully', ingredient);

      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   { id: Math.random().toString(), ...ingredient }
      // ]);
      dispatchHttp({ type: 'RESPONSE' });
      dispatch({ type: 'ADD', ingredient: { id: Math.random().toString(), ...ingredient } });
    } catch (error) {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      console.log('Adding ingredient failed', { ingredient, error });
    }
  }, []);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // setUserIngredients(filteredIngredients);
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  const removeIngredientHandler = useCallback(async ingredientId => {
    dispatchHttp({ type: 'SEND' });

    try {
      await fetch(`${DUMMY_API_URL}/${ingredientId}`, { method: 'DELETE' });
      console.log('Deleted ingredient successfully', { ingredientId });

      // setUserIngredients(prevIngredients => {
      //   return prevIngredients.filter(ingredient => ingredient.id !== ingredientId);
      // });
      dispatchHttp({ type: 'RESPONSE' });
      dispatch({ type: 'DELETE', id: ingredientId });
    } catch (error) {
      dispatchHttp({ type: 'ERROR', errorMessage: 'Something went wrong!' });
      console.log('Ingredient deletion failed', { ingredientId });
    }
  }, []);

  const clearError = () => {
    dispatchHttp({ type: 'CLEAR' });
  };

  const ingredientList = useMemo(() => {
    return <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />;
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
