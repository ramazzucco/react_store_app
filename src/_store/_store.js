import { BehaviorSubject } from "rxjs";

const STORAGE_KEY = "asda12$d12-gd8.12s17$-ad1$&%";

export const log = (state) => {
    let stateName = state.name.split('-').filter(str => str !== '-');
    stateName = stateName.map(str => str.toUpperCase());
    if(stateName.length > 1) {
        stateName = stateName.join(' - ');
    }
    const colors = {
        LANGUAGE: 'orange',
        THEME: 'burlywood',
        WIDGETS: 'red',
        USER: 'blue',
        TEAM: 'blueviolet'
    }
    console.log(`%c[ STATE > ${stateName} ]:%c ${state.action}`, `color: ${colors[state.name.split('-')[0].toUpperCase()]}`, 'color: white');
}

export const SaveState = (state) => {
    let store = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (store) {
        store = {
            ...store,
            [state.name]: state.value,
        };
    } else {
        store = {
            [state.name]: state.value,
        };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));

    log(state);
};

export const get = (stateName) => {
    const store = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (store) {
        if (!stateName) return store;

        const keys = stateName.split("-").filter((str) => str !== "-");

        if (!keys) return;

        if (keys.length === 1) {
            return store[keys[0]];
        } else if (keys.length === 2 && store[keys[0]]) {
            return store[keys[0]][keys[1]];
        }
    }
};

let _states = [];
const newStateInitialized$ = new BehaviorSubject([]);

export const initModule = async (states) => {
    _states.push(...states);
    newStateInitialized$.next(states);
}

export const storeFns = {
    get,
    SaveState,
    log,
}