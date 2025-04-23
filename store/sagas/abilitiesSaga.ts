import { call, put, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import * as SQLite from 'expo-sqlite';
import { Root } from '~/type/type';

// Open database
const db = SQLite.openDatabaseSync('pokemon.db');


// Create tables if they don't exist
function initDatabase() {
  return new Promise((resolve, reject) => {
    return db.withExclusiveTransactionAsync(async (tsx) => {
      tsx.execSync(
        `CREATE TABLE IF NOT EXISTS abilities (id INTEGER PRIMARY KEY, name TEXT, data TEXT)`,
      );
      await tsx.execAsync(`PRAGMA user_version = 4`);
    });
  });
}

// Get abilities from SQLite
function getAbilitiesFromDB(page: number, limit: number = 20) {
    const offset = (page - 1) * limit;
    return db.withExclusiveTransactionAsync(async (tsx) => {
      return tsx.runAsync(
        `SELECT * FROM abilities ORDER BY id LIMIT ? OFFSET ?`,
        limit,
        offset,
      );
  });
}

// Save ability to SQLite
function saveAbilityToDB(ability: any) {
    return db.withExclusiveTransactionAsync(async (tsx) => {
     return await tsx.runAsync(
        'INSERT OR REPLACE INTO abilities (id, name, data) VALUES (?, ?, ?)',
        ability.id, ability.name, JSON.stringify(ability)
      );
    });
}

// Fetch ability from API
function fetchAbilityFromAPI(id: number) {
  return axios.get<Root>(`https://pokeapi.co/api/v2/ability/${id}/`);
}

function* fetchAbilities(action: any) {
  try {
    // Initialize database
    yield call(initDatabase);
    
    const { page } = action.payload;
    const limit = 20;
    const startId = (page - 1) * limit + 1;
    const endId = page * limit;

    // Try to get abilities from SQLite first
    const dbAbilities:any = yield call(getAbilitiesFromDB, page, limit);
    
    console.log({dbAbilities});
    
    // If we have all abilities in the database for this page, use them
    if (dbAbilities.length === limit) {
      yield put({
        type: 'FETCH_ABILITIES_SUCCESS',
        payload: { abilities: dbAbilities, page }
      });
    } else {
      // Otherwise fetch from API
      const apiRequests = [];
      for (let id = startId; id <= endId; id++) {
        if (id <= 300) { // Limit to 300 as per requirements
          apiRequests.push(call(fetchAbilityFromAPI, id));
        }
      }
      
      const responses = yield all(apiRequests);
      console.log({responses});
      
      const abilities = responses.map((response: any) => response.data);
      
      // Save each ability to SQLite
      for (const ability of abilities) {
        yield call(saveAbilityToDB, ability);
      }
      
      yield put({
        type: 'FETCH_ABILITIES_SUCCESS',
        payload: { abilities, page }
      });
    }
  } catch (error) {
    console.log({error});
    
    yield put({
      type: 'FETCH_ABILITIES_FAILURE',
      payload: error?.message
    });
  }
}

export function* abilitiesSaga() {
  yield takeLatest('FETCH_ABILITIES_REQUEST', fetchAbilities);
}