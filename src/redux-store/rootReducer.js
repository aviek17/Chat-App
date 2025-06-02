import { combineReducers } from '@reduxjs/toolkit';
import menuDrawerReducer from "./slice/MenuDrawerSlice"

const rootReducer = combineReducers({
    navigationState: menuDrawerReducer
});

export default rootReducer;