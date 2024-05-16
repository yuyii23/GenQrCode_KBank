import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  BrandGroupApiResponseType,
  BrandGroupProductListType,
  SearchBrandGroupApiResponseType,
} from '@/types/Application/';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';

export const useBrandGroupStore = defineStore('BrandGroup', {
  state: (): BrandGroupApiResponseType => {
    return {
      totalProducts: 0,
      nameClassification: '',
      productList: [] as BrandGroupProductListType[],
    };
  },
  getters: {
    getBrandList(): BrandGroupProductListType[] {
      return this.productList;
    },
    getNameClassification(): string {
      return this.nameClassification;
    },
    getTotalProducts(): number {
      return this.totalProducts;
    },
  },
  actions: {
    async fetchBrandGroupList(id: string) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<BrandGroupApiResponseType>
        >(`/api/v1/Classification/${id}`);

        if (status === 200 && data.isResult) {
          this.totalProducts = data.data.totalProducts;
          this.nameClassification = data.data.nameClassification;
          this.productList = data.data.productList;
        } else {
          toast.error(data.message || 'Fetch Brand Group List Error');
        }
      } catch (error) {
        toast.error('Fetch Brand Group List Error');
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
          ApiResponseType<SearchBrandGroupApiResponseType>
        >(`/api/v1/Classification/Product/${id}/${type}/${filter}`);

        if (status === 200 && data.isResult) {
          this.totalProducts = data.data.totalProducts;
          this.nameClassification = data.data.nameClassification;
          this.productList = [];
          data.data.productGroupList.map((item) => {
            this.productList.push(...item.productList);
          });
        } else {
          toast.error(data.message || 'Fetch Brand Group List Error');
        }
      } catch (error) {
        toast.error('Fetch Brand Group List Error');
        console.log(error);
      }
    },
  },
});
