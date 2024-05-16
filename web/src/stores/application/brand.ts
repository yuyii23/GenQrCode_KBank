import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  BrandApiResponseType,
  GroupListType,
  BrandStateType,
  CategoriesType,
  BrandSearchResultType,
} from '@/types/Application/';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';

export const useBrandStore = defineStore('Brand', {
  state: (): BrandStateType => {
    return {
      newCategories: 0,
      totalCategories: 0,
      groupList: [] as GroupListType[],
      searchResult: {
        totalCategories: 0,
        resultLists: [],
      },
    };
  },
  getters: {
    getBrandList(): GroupListType[] {
      return this.groupList;
    },
    getNewCategories(): number {
      return this.newCategories;
    },
    getTotalCategories(): number {
      return this.totalCategories;
    },
    getSearchResult(): CategoriesType[] {
      return this.searchResult.resultLists;
    },
    getSearchTotal(): number {
      return this.searchResult.totalCategories;
    },
  },
  actions: {
    async fetchBrandList(id: string) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<BrandApiResponseType>
        >(`/api/v1/Cateogries/${id}`);

        if (status === 200 && data.isResult) {
          this.newCategories = data.data.newCategories;
          this.totalCategories = data.data.totalCategories;
          this.groupList = data.data.groupList;
        } else {
          toast.error(data.message || 'Fetch Brand List Error');
        }
      } catch (error) {
        toast.error('Fetch Brand List Error');
        console.log(error);
      }
    },
    async fetchBrandListByFilter(
      id: string,
      type: 'alpha' | 'text',
      filter: string
    ) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<BrandApiResponseType>
        >(`/api/v1/Cateogries/${id}/${type}/${filter}`);

        if (status === 200 && data.isResult) {
          this.groupList = data.data.groupList;
        } else {
          toast.error(data.message || 'Fetch Brand List Error');
        }
      } catch (error) {
        toast.error('Fetch Brand List Error');
        console.log(error);
      }
    },
    async fetchSearchBrandListByFilter(filter: string) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<BrandSearchResultType>
        >(`/api/v1/Filter/Categories/${filter}`);

        if (status === 200 && data.isResult) {
          this.searchResult = {
            totalCategories: data.data.totalCategories,
            resultLists: data.data.resultList,
          };
        } else {
          toast.error(data.message || 'Fetch Brand List Error');
        }
      } catch (error) {
        toast.error('Fetch Brand List Error');
        console.log(error);
      }
    },
  },
});
