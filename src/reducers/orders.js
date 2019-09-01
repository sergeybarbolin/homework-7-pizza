import { CREATE_NEW_ORDER } from '../modules/clients';
import { MOVE_ORDER_NEXT, MOVE_ORDER_BACK } from '../actions/moveOrder';
import { ADD_INGREDIENT } from '../actions/ingredients';

// Реализуйте редьюсер
// Типы экшенов, которые вам нужно обрабатывать уже импортированы
// Обратите внимание на `orders.test.js`.
// Он поможет понять, какие значения должен возвращать редьюсер.

export default (state = [], action) => {
  const positions = ['clients', 'conveyor_1', 'conveyor_2', 'conveyor_3', 'conveyor_4', 'finish'];
  const newPosition = (order, method) => {
    const {position, ingredients, recipe} = order;
    let index = positions.indexOf(position);

    if ( method === 'next' && (
          index + 1 < (positions.length - 1) || 
          (positions[index + 1] === 'finish' && recipe.length === ingredients.length)
        )) 
    {
      index++
    };
    
    if (method === 'back' && index - 1 !== 0) {
      index--;
    } 

    return positions[index];
  }

  switch (action.type) {
    case CREATE_NEW_ORDER:
      return [
        ...state, 
        {
          ...action.payload,
          'ingredients': [], 
          'position': 'clients'
        } 
      ]

    case MOVE_ORDER_NEXT: {
      const id = action.payload;
      const orders = [...state]
      const currentOrderIndex = orders.findIndex(order => order.id === id);
      const currentOrder = orders[currentOrderIndex];
      
      orders[currentOrderIndex].position = newPosition(currentOrder, 'next');

      return orders;
    }

    case MOVE_ORDER_BACK: {
      const id = action.payload;
      const orders = [...state]
      const currentOrderIndex = orders.findIndex(order => order.id === id);
      const currentOrder = orders[currentOrderIndex];

      orders[currentOrderIndex].position = newPosition(currentOrder, 'back');
      
      return orders;
    }
    
    case ADD_INGREDIENT: {
      const { from, ingredient } = action.payload;
      const orders = [...state];
      const currentOrderIndex = orders.findIndex(order => order.position === from);
      const currentOrder = orders[currentOrderIndex];

      if (currentOrder && 
          currentOrder.recipe.includes(ingredient) && 
          !currentOrder.ingredients.includes(ingredient)) 
      {
        currentOrder.ingredients = [...currentOrder.ingredients, ingredient];
      }

      return orders;
    }

    default:
      return state;
  }
};

export const getOrdersFor = (state, position) =>
  state.orders.filter(order => order.position === position);
