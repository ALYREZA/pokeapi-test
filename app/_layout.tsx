import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    // Initialize database when app starts
    const db = SQLite.openDatabaseSync('pokemon.db');
    db.execSync(
        'CREATE TABLE IF NOT EXISTS abilities (id INTEGER PRIMARY KEY, name TEXT, data TEXT)'
      );
  },[]);

  return (
    <Provider store={store}>
      <Stack screenOptions={{headerShown: false}} />
    </Provider>
  );
}
