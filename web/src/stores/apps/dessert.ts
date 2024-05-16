import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type { dessertType } from '@/types/ui-elements/DessertType';
import type { paginationType } from '@/types/PaginationType';

interface dessertTypeDe {
  totalPage: number;
  desserts: dessertType[];
  dessert: dessertType;
}

export const useDessertStore = defineStore({
  id: 'dessert',
  state: (): dessertTypeDe => ({
    totalPage: 0,
    desserts: [],
    dessert: {} as dessertType,
  }),
  getters: {
    // Get Desserts from Getters
    getDesserts(state) {
      return state.desserts;
    },
    getTotalPage(state) {
      return state.totalPage;
    },
    // Get Dessert from Getters
    getDessertById(state) {
      return state.dessert;
    },
  },
  actions: {
    async fetchDesserts(
      pageNumber: number,
      pageSize: number,
      filter: string,
      sort: string,
      sortField: string
    ) {
      try {
        const data = await axios.get<paginationType<dessertType>>(
          '/api/desserts',
          {
            params: {
              pageNumber,
              pageSize,
              filter,
              sort,
              sortField,
            },
          }
        );
        this.totalPage = data.data.totalPage;
        this.desserts = data.data.data;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async fetchDessertsById(id: string) {
      try {
        const response = await axios.get<dessertType>('/api/dessert', {
          params: { id },
        });

        this.dessert = response.data;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    setDessert(data: dessertType) {
      this.dessert = data;
    },
    async updateDessert(data: dessertType) {
      try {
        await axios.put('/api/dessert', data, {
          params: { id: data.id },
        });
        this.dessert = data;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
    async deleteDessert(id: string) {
      try {
        await axios.delete('/api/dessert', {
          params: { id },
        });
        this.dessert = {} as dessertType;
      } catch (error) {
        alert(error);
        console.log(error);
      }
    },
  },
});
