interface Ability {
  id: number;
  name: string;
  effect_entries: Array<{
    short_effect: string;
    language: {
      name: string;
    };
  }>;
}

interface AbilitiesState {
  abilities: Ability[];
  loading: boolean;
  error: string | null;
  currentPage: number;
}

const initialState: AbilitiesState = {
  abilities: [],
  loading: false,
  error: null,
  currentPage: 0,
};

export const abilitiesReducer = (state = initialState, action: any): AbilitiesState => {
  switch (action.type) {
    case 'FETCH_ABILITIES_REQUEST':
      console.log({state});
      
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'FETCH_ABILITIES_SUCCESS':
      return {
        ...state,
        loading: false,
        abilities: [...state.abilities, ...action.payload.abilities],
        currentPage: action.payload.page,
      };
    case 'FETCH_ABILITIES_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};