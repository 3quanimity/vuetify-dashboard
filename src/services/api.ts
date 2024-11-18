import { fetchMonetizationApi as fetchMock } from '@/data/mock/monetization-api';

const USE_MOCK = true; // Toggle between mock and real API

export const apiService = {
  fetchMonetizationData: async () => {
    if (USE_MOCK) {
      // Mocked API call
      return fetchMock();
    }
    
    // Real API call
    const response = await fetch('https://www.anthony-cardinale.fr/_placeholder/monetization-api.json');
    return response.json();
  }
};