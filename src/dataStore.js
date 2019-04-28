import { getImageDetailsAtUrl } from './getImageDetailsAtUrl';
import { DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const arrayOfComics = [];
let index = 0;
let prefetchIndex = 0;
let buffer = 5;
let isUpdating = false;

export const getIndex = () => index;
export const setIndex = (idx) => {
    index = idx;

    if (index + buffer > arrayOfComics.length) {
        prefetchComics(buffer);
    }

    return Promise.resolve();
};

const getInitialData = async () => {
    const url = 'https://www.smbc-comics.com';

    const results = await getComic(url, false);

    arrayOfComics.push(results);
}

const prefetchComics = async (amount = buffer, shouldEmit = true) => {
    if (isUpdating) {
        return;
    } else {
        isUpdating = true;
        return await recursiveFetch(arrayOfComics[prefetchIndex].prev, amount, shouldEmit);
    }
}

const recursiveFetch = async (url, amount, shouldEmit) => {
    if (amount === 0) {
        isUpdating = false;
        shouldEmit && DeviceEventEmitter.emit('refresh', arrayOfComics);
        return;
    }

    const cachedData = await _retrieveData(url);
    const results = cachedData || await getComic(url);
    prefetchIndex++;

    arrayOfComics[prefetchIndex] = results;
    return recursiveFetch(results.prev, amount - 1, shouldEmit);
}

const getComic = async (url, shouldCache = true) => {
    const results = await getImageDetailsAtUrl(url);

    shouldCache &&  _storeData(url, results);

    return results;
}

// Get Initial Data
getInitialData().then(() => {
    DeviceEventEmitter.emit('refresh', arrayOfComics);
    prefetchComics();
});


const _storeData = (key, value) => {
    try {
        AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        // Error saving data
    }
};

const _retrieveData = async (key) => {
    try {
        let value = await AsyncStorage.getItem(key);
        if (value !== null) {
            value = JSON.parse(value);
        }
        return value;
    } catch (error) {
        // Error retrieving data
    }
    return;
};

export {
    arrayOfComics,
    prefetchComics,
}