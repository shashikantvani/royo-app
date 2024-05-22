import { createStore} from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
const middlewares = [thunk];
// , applyMiddleware(...middlewares)
export default createStore(reducer);
