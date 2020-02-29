import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = (props) => {
    const [userIngredients, setUserIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    // useEffect(() => {
    //     fetch('https://react-hooks-d86db.firebaseio.com/ingredients.json')
    //         .then(response => response.json())
    //         .then(responseData => {
    //             const loadedIngredients = [];
    //             for (let key in responseData) {
    //                 loadedIngredients.push({
    //                     id: key,
    //                     title: responseData[key].title,
    //                     amount: responseData[key].amount
    //                 });
    //             }
    //             setUserIngredients(loadedIngredients);
    //         });
    // }, []);

    useEffect(() => {
        console.log('RENDERING INGREDIENTS', userIngredients);
    }, [userIngredients]);

    const filteredIngredientsHandler = useCallback(filteredIngredients => {
        setUserIngredients(filteredIngredients);
    },[]);

    const addIngredientHandler = ingredient => {
        setIsLoading(true);
        fetch('https://react-hooks-d86db.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            setIsLoading(false);
            return response.json();
        }).then(responseData => {
            setUserIngredients(prevIngredients => [
                ...prevIngredients,
                { id: responseData.name, ...ingredient }
            ]);
        });
    };

    const removeIngredientHandler = id => {
        setIsLoading(true);
        fetch(`https://react-hooks-d86db.firebaseio.com/ingredients/${id}.jon`, {
            method: 'DELETE'
        }).then(response => {
            setIsLoading(false);
            setUserIngredients(prevIngredients => prevIngredients.filter(ing => ing.id !== id));
        }).catch(error => {
            setError('Something went wrong!');
            setIsLoading(false);
        });
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm
                onAddIngredient={addIngredientHandler}
                loading={isLoading}
            />

            <section>
                <Search onLoadIngredients={filteredIngredientsHandler}/>
                <IngredientList
                    ingredients={userIngredients}
                    onRemoveItem={removeIngredientHandler}/>
            </section>
        </div>
    );
};

export default Ingredients;
