import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  productType,
  productStateType,
  ProductDetailType,
  SubjectType,
  productSearchResultType,
} from '@/types/Application/';
import type { ApiResponseType } from '@/types/ApiResponseType';
import type { DropDownListType } from '@/types/DropDownListType';
import { useToast } from 'vue-toast-notification';
import { router } from '@/router';

export const useProductStore = defineStore('ProductsList', {
  state: (): productStateType => {
    return {
      productList: [] as productType[],
      pageCount: 0,
      detail: null,
      subject: [],
      searchResult: {
        pageCount: 0,
        totalProducts: 0,
        resultLists: [],
      },
    };
  },
  getters: {
    getProductList(): productType[] {
      return this.productList;
    },
    getPageCount(): number {
      return this.pageCount;
    },
    getProductDetail(): ProductDetailType | null {
      return this.detail;
    },
    getDropDownSubject(): DropDownListType[] {
      return this.subject.map((item) => ({
        value: item.code,
        title: item.name,
      }));
    },
    getSearchResult(): productType[] {
      return this.searchResult.resultLists;
    },
    getSearchPageCount(): number {
      return this.searchResult.pageCount;
    },
    getSearchTotal(): number {
      return this.searchResult.totalProducts;
    },
  },
  actions: {
    async fetchProduct() {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<productType[]>
        >('/api/v1/Contents/products');
        if (status === 200 && data.isResult) {
          this.productList = data.data;
          this.pageCount = data.pageCount;
        } else {
          toast.error(data.message || 'Fetch product error');
        }
      } catch (error) {
        toast.error('Fetch product error');
        console.log(error);
      }
    },
    async fetchProductDetail(objectId: string) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<ProductDetailType>
        >(`/api/v1/products/${objectId}`);
        if (status === 200 && data.isResult) {
          this.detail = data.data;
          return data.data;
        } else {
          toast.error(data.message || 'Fetch product detail error');
          router.back();
        }
      } catch (error) {
        toast.error('Fetch product detail error');
        console.log(error);
        router.back();
      }
    },
    async fetchSearchProductByFilter(page: number, filter: string) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<productSearchResultType>
        >(`/api/v1/Filter/Product/${filter}`, { params: { page } });

        if (status === 200 && data.isResult) {
          this.searchResult = {
            pageCount: data.pageCount,
            totalProducts: data.data.totalProducts,
            resultLists: data.data.resultList,
          };
        } else {
          toast.error(data.message || 'Fetch product search result error');
        }
      } catch (error) {
        toast.error('Fetch product search result error');
        console.log(error);
      }
    },
    async fetchProductSubject() {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<SubjectType[]>
        >('/api/v1/products/parameter/subject');

        if (status === 200 && data.isResult) {
          this.subject = data.data;
        } else {
          toast.error(data.message || 'Fetch product subject error');
        }
      } catch (error) {
        toast.error('Fetch product subject error');
        console.log(error);
      }
    },
    async sendContact(
      objectId: string,
      name: string,
      email: string,
      subjectId: string,
      message: string,
      coobjectId: string,
      memberId: string | undefined = undefined
    ) {
      const toast = useToast();
      try {
        const { data, status } = await axios.post<ApiResponseType<null>>(
          '/api/v1/products',
          {
            objectId,
            name,
            email,
            subjectId,
            message,
            memberId,
            coobjectId,
          }
        );

        if (status === 200 && data.isResult) {
          toast.success(data.message || 'Message sent successfully');
        } else {
          toast.error(data.message || 'Failed to send message');
        }
      } catch (error) {
        toast.error('Failed to send message');
        console.log(error);
      }
    },
  },
});
