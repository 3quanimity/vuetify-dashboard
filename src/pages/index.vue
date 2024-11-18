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
          >
            <FilterBloc
              v-if="selectedTab == 0"
              @search-value-changed="updateSearchValue"
            />
          </v-col>

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
              <!-- KPI overview -->
              <v-row>
                <v-col>
                  <KpiBloc
                    :is-up="false"
                    bloc-title="Total Android revenues"
                    :bloc-value="getTotalOsRevenues('android')"
                  />
                </v-col>
                <v-col>
                  <KpiBloc
                    :is-up="true"
                    bloc-title="Total iOS revenues"
                    :bloc-value="getTotalOsRevenues('ios')"
                  />
                </v-col>
                <v-col>
                  <KpiBloc
                    :is-up="true"
                    bloc-title="Total revenues"
                    :bloc-value="getTotalOsRevenues('')"
                  />
                </v-col>
              </v-row>

              <v-divider class="mt-4" />
              
              <h2 class="mt-4">
                Apps List:
              </h2>

              <v-data-table 
                v-if="groupedData"
                v-model:expanded="expanded" 
                :items="groupedData"
                :headers="headers"
                item-value="app"
                show-expand 
                :search="searchValue"
              >
                <!-- customizing column titles example -->
                <template #header.app="{ column }">
                  {{ column.title.toUpperCase() }}
                </template>

                <!-- expandable zone -->
                <template #expanded-row="{ columns, item }">
                  <tr>
                    <td :colspan="columns.length">
                      <div style="padding: 15px">
                        <p>
                          The country that generated the most revenue for
                          {{ item.app }} is {{ useGetBestCountry(item) }}
                        </p>
                        <br>

                        <!-- Chart  -->
                        <BarChart
                          class="d-flex mx-auto my-0"
                          :data="[
                            item.totalRevenuesUS,
                            item.totalRevenuesUK,
                            item.totalRevenuesFR,
                            item.totalRevenuesJP,
                            item.totalRevenuesAU,
                            item.totalRevenuesCN,
                          ]"
                        />
                        <br>

                        <!-- Details Row  -->
                        <v-row>
                          <!-- column 1 -->
                          <v-col>
                            Total ads views: <b>{{ item.totalViews }}</b> <br>
                            Total conversions: <b>{{ item.totalConversions }}</b>
                            <br>
                            Conversions %:
                            <b>{{
                              (
                                (item.totalConversions * 100) /
                                item.totalViews
                              ).toFixed(2)
                            }}
                              %</b>
                            <br>
                            Total revenues:
                            <b>{{ useFormatRevenues(item.totalRevenues) }}</b>
                          </v-col>
                          <!-- column 2 -->
                          <v-col>
                            Total banner revenues:
                            <b>{{ useFormatRevenues(item.banner) }}</b><br>
                            Total full-screen revenues:
                            <b>{{ useFormatRevenues(item.fullscreen) }}</b><br>
                            Total video revenues:
                            <b>{{ useFormatRevenues(item.video) }}</b><br>
                            Total rewarded revenues:
                            <b>{{ useFormatRevenues(item.rewarded) }}</b><br>
                          </v-col>
                        </v-row>
                      </div>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-sheet>

            <v-sheet
              v-else
              rounded="lg"
              class="pa-2"
            >
              <AboutPage />
            </v-sheet>
          </v-col>

          <!-- RIGHT COLUMN -->
          <v-col
            cols="12"
            sm="2"
          >
            <v-sheet
              v-if="selectedTab == 0"
              rounded="lg"
              class="pa-3"
              min-height="87vh"
            >
              <v-list-item-title class="text-h5 mb-1 mt-2">
                Contact
              </v-list-item-title>
              <p>Reach out to us</p>
              <div class="d-flex align-center mt-2 mb-2">
                <img
                  src="@/assets/icons/phone.svg"
                  alt="Phone Icon"
                  class="me-2"
                  style="width: 24px; height: 24px;"
                >
                <p>
                  07 59 69 08 80
                </p>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
// Imports
import { ref, watch, onMounted } from "vue";
import { apiService } from '@/services/api';
import useGroupApps from "../utils/useGroupApps"
import useFormatRevenues from "../utils/useFormatRevenues"
import useGetBestCountry from "../utils/useGetBestCountry"

// Components
import KpiBloc from "@/components/KpiBloc.vue";
import FilterBloc from "@/components/FilterBloc.vue";
import AboutPage from "@/components/AboutPage.vue";

// Variables
const selectedTab = ref(0);
const links = ref(["Dashboard", "About"]);
const apiResult = ref()
const groupedData = ref<any[]>([]) // // Explicitly allow any[] to fix the error: Type 'any[]' is not assignable to type 'never[]'
const expanded = ref([]);
const searchValue = ref("");

const headers = ref([
  { title: "App",   key: "app" },
  { title: "US",    key: "totalRevenuesUS" },
  { title: "UK",    key: "totalRevenuesUK" },
  { title: "FR",    key: "totalRevenuesFR" },
  { title: "JP",    key: "totalRevenuesJP" },
  { title: "CN",    key: "totalRevenuesCN" },
  { title: "AU",    key: "totalRevenuesAU" },
  { title: "Total", key: "totalRevenues" },
  { title: "",      key: "data-table-expand" }, // expand row for more details
]);

// Vue lifecycles
onMounted(async () => {
  try {
    const data = await apiService.fetchMonetizationData();
    apiResult.value = data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

// Vue Functions 
watch(apiResult, (newValue) => {
  groupedData.value = useGroupApps(newValue.data)
})

// Functions
const getTotalOsRevenues= (os = "") => {
  let total = 0;
  groupedData.value.forEach((app: any) => {
    if (os !== "") {
      total += app.platform == os ? app.totalRevenues : 0;
    } else {
      total += app.totalRevenues;
    }
  });

  return `${useFormatRevenues(total)}`;
};

const updateSearchValue = (val: any) => {
  searchValue.value = val
}

</script>
