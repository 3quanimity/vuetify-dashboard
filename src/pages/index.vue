<template>
  <v-app>
    <!-- TOP BAR  -->
    <v-app-bar
      class="px-3"
      color="grey-darken-4"
      flat
      density="compact"
    >
      <v-spacer />
      <v-tabs
        v-model="selectedTab"
        centered
        color="grey-darken-1"
      >
        <v-tab
          v-for="link in links"
          :key="link"
        >
          {{ link }}
        </v-tab>
      </v-tabs>
      <v-spacer />
    </v-app-bar>

    <!-- CONTAINER -->
    <v-main>
      <v-container fluid>
        <v-row>
          <!-- LEFT COLUMN -->
          <v-col
            cols="12"
            sm="2"
          />

          <!-- MAIN COLUMN -->
          <v-col
            cols="12"
            sm="8"
          >
            <v-sheet
              v-if="selectedTab == 0"
              min-height="70vh"
              rounded="lg"
              class="pa-4"
            >
              <h2 class="mt-4">
                Apps List:
              </h2>
              {{ apiResult }}
            </v-sheet>

            <v-sheet
              v-else
              min-height="70vh"
              rounded="lg"
              class="pa-2 pt-4"
            />
          </v-col>

          <!-- RIGHT COLUMN -->
          <v-col
            cols="12"
            sm="2"
          />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
// Imports
import { ref, watch, onMounted } from "vue";
import { fetchMonetizationApi } from '@/data/mock/monetization-api';

// Variables
const selectedTab = ref(0);
const links = ref(["Dashboard", "About"]);
const apiResult = ref()

// Vue lifecycles
onMounted(async () => {
  await fetchMockData();
})

// API
// Mock API call
const fetchMockData = async () => {
  try {
    const response = await fetchMonetizationApi();
    apiResult.value = response;
  } catch (error) {
    console.error('Error fetching mock data:', error);
  }
};
</script>
