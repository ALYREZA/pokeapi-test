import { Stack } from 'expo-router';
import { StyleSheet, View, FlatList, Text, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function AbilitiesScreen() {
  const dispatch = useDispatch();
  const { abilities, loading, currentPage } = useSelector(state => state.abilities);
  console.log({abilities, loading, currentPage});
  
  useEffect(() => {
    // Initial data load
    if (abilities.length === 0) {
      dispatch({ type: 'FETCH_ABILITIES_REQUEST', payload: { page: 1 } });
    }
  }, []);

  const handleLoadMore = () => {
    if (!loading) {
      dispatch({ type: 'FETCH_ABILITIES_REQUEST', payload: { page: currentPage + 1 } });
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.abilityItem}>
      <Text style={styles.abilityName}>{item.name}</Text>
      <Text style={styles.abilityDescription}>{item.effect_entries?.[0]?.short_effect || 'No description available'}</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Pokemon Abilities' }} />
      <View style={styles.container}>
        <FlatList
          data={abilities}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            loading ? null : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No abilities found</Text>
              </View>
            )
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  abilityItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  abilityName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  abilityDescription: {
    fontSize: 14,
    color: '#666',
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
