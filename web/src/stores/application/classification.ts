import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  classificationsType,
  classificationStateType,
  classificationGroupType,
  productByCompanyType,
} from '@/types/Application/';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';

export const useClassificationStore = defineStore('Classification', {
  state: (): classificationStateType => {
    return {
      newClassification: 0,
      totalClassification: 0,
      list: [] as classificationGroupType[],
      productByCompany: null,
    };
  },
  getters: {
    getNewClassification(): number {
      return this.newClassification;
    },
    getTotalClassification(): number {
      return this.totalClassification;
    },
    getClassificationList(): classificationGroupType[] {
      return this.list;
    },
    getProductByCompanyList(): productByCompanyType | null {
      return this.productByCompany;
    },
  },
  actions: {
    async fetchClassificationList() {
      const toast = useToast();
      try {
        const { status, data } = await axios.get<
          ApiResponseType<classificationsType>
        >('/api/v1/Classification');

        if (status === 200 && data.isResult) {
          this.newClassification = data.data.newClassification;
          this.totalClassification = data.data.totalClassification;
          this.list = data.data.groupList;
        } else {
          toast.error(data.message || 'Fetch Classification List Error');
        }
      } catch (error) {
        toast.error('Fetch Classification List Error');
        console.error(error);
      }
    },
    async fetchCompanyClassificationListFilter(
      type: 'alpha' | 'text',
      filter: string
    ) {
      const toast = useToast();
      try {
        const { status, data } = await axios.get<
          ApiResponseType<classificationsType>
        >(`/api/v1/Classification/${type}/${filter}`);

        if (status === 200 && data.isResult) {
          this.newClassification = data.data.newClassification;
          this.totalClassification = data.data.totalClassification;
          this.list = data.data.groupList;
        } else {
          toast.error(data.message || 'Fetch Classification List Error');
        }
      } catch (error) {
        toast.error('Fetch Classification List Error');
        console.error(error);
      }
    },
    async fetchProductByCompanyList(objectId: string) {
      const toast = useToast();
      try {
        const { status, data } = await axios.get<
          ApiResponseType<productByCompanyType>
        >(`/api/v1/Classification/Product/${objectId}`);

        if (status === 200 && data.isResult) {
          this.productByCompany = data.data;
        } else {
          toast.error(data.message || 'Fetch Product By Company List Error');
        }
      } catch (error) {
        toast.error('Fetch Product By Company List Error');
        console.error(error);
      }
    },
    async fetchProductByCompanyListFilter(
      objectId: string,
      type: 'alpha' | 'text',
      filter: string
    ) {
      const toast = useToast();
      try {
        const { status, data } = await axios.get<
          ApiResponseType<productByCompanyType>
        >(`/api/v1/Classification/Product/${objectId}/${type}/${filter}`);

        if (status === 200 && data.isResult) {
          this.productByCompany = data.data;
        } else {
          toast.error(data.message || 'Fetch Product By Company List Error');
        }
      } catch (error) {
        toast.error('Fetch Product By Company List Error');
        console.error(error);
      }
    },
  },
});
