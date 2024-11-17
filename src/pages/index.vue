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
              Page 0
            </v-sheet>

            <v-sheet
              v-else
              min-height="70vh"
              rounded="lg"
              class="pa-2 pt-4"
            >
              Page 1
            </v-sheet>
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

// Variables
const selectedTab = ref(0);
const links = ref(["Dashboard", "About"]);
</script>
