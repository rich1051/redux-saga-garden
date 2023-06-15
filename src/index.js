import React from 'react';
import ReactDOM from 'react-dom/client';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import createSagaMiddleware from "redux-saga";
import { takeLatest, put } from "redux-saga/effects";
import axios from "axios";
import App from './App';

// this startingPlantArray should eventually be removed
const startingPlantArray = [
  { id: 1, name: 'Rose' },
  { id: 2, name: 'Tulip' },
  { id: 3, name: 'Oak' }
];

const plantList = (state = startingPlantArray, action) => {
  switch (action.type) {
    case 'ADD_PLANT':
      return [ ...state, action.payload ]
    default:
      return state;
  }
};

function* fetchPlant () {
  try {
    // hold response from server in plantResponse:
    const plantResponse = yield axios.get("/api/plant");
    // ...after server responds, then this generator function/saga continues
    yield put({ type: "ADD_PLANT", payload: plantResponse.data });
  } catch (error) {
    console.log("Error fetching plants:", error);
  }
}

function* postPlant(action) {
  try {
    console.log("firstSaga was hit with action:", action);
// hold response from server in newElement:
    yield axios.post("/api/plant", action.payload);
// ...after server responds, then this generator function/saga continues
    yield put({ type: "FETCH_PLANT" });
  } catch (error) {
    console.log("Error posting plant:", error);
  }
}


function* rootSaga() {
    yield takeLatest("FETCH_PLANT", fetchPlant);
    yield takeLatest("POST_PLANT", postPlant);
  }

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({ plantList }),
  applyMiddleware(sagaMiddleware, logger)
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);