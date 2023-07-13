//import { createStore } from 'https://cdn.skypack.dev/redux';

function createStore(reducer) {
    const subscribers = [];
    let state = reducer(undefined, {});
    return {
        getState() {
            return state;
        },
        dispatch(action) {
            state = reducer(state,action);
            subscribers.forEach(subscriber=> subscriber());
        },
        subscribe(subscriber) {
            subscribers.push(subscriber);
        }
    }
}



/////////////My app//////////////////
//reducer
function bankReducer(state = 0,action){
    switch(action.type){
        case 'DEPOSIT':
            return state + action.payload;
        case 'WITHDRAW':
            return state - action.payload;
        default:
            return state
    }
}

// store
const store =window.store = createStore(bankReducer)

//actions
function actionDeposit(payload){
    return {
        type: 'DEPOSIT',
        payload
    }
}

function actionWithdraw(payload) {
    return {
        type: 'WITHDRAW',
        payload
    }
}

//DOM event 
const deposit= document.querySelector('#deposit');
const withdraw= document.querySelector('#withdraw');

//Event handle
deposit.onclick =function() {
    store.dispatch(actionDeposit(10));
}

withdraw.onclick = function() {
    store.dispatch(actionWithdraw(10));
}

//Listener
store.subscribe(() =>{
    render();
}); 

//render
function render() {
    const output = document.querySelector('#output');
    output.innerText = store.getState();
}

render()