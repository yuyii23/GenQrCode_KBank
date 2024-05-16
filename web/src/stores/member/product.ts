import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  ProductStateType,
  ProductType,
  ProductDetailType,
  ResponseType,
} from '@/types/member';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';
import { router } from '@/router';

export const useProductStore = defineStore({
  id: 'ProductSupplier',
  state: (): ProductStateType => ({
    list: {
      data: [],
      totalPage: 0,
    },
    detail: null,
  }),
  getters: {
    getProductList(): ProductType[] {
      return this.list.data;
    },
    getProduct(state) {
      return (id: string) => {
        return state.list.data.find((product) => product.objectId === id);
      };
    },
    getProductTotalPage(): number {
      return this.list.totalPage;
    },
    getProductDetail(): ProductDetailType | null {
      return this.detail;
    },
  },
  actions: {
    async createProduct(
      supplierId: string,
      coobjectId: string,
      nameTH: string,
      nameEN: string,
      detailTH: string,
      detailEN: string,
      pictureFile: File[]
    ) {
      const body = new FormData();
      body.append('coobjectId', coobjectId);
      body.append('nameTH', nameTH);
      body.append('nameEN', nameEN);
      body.append('detailTH', detailTH);
      body.append('detailEN', detailEN);
      pictureFile.forEach((file) => {
        body.append('pictureFile', file);
      });

      const { status, data } = await axios.postForm<ResponseType>(
        `/api/v1/Suppliers/request/product/add/${supplierId}`,
        body
      );

      const toast = useToast();
      if (data.isResult) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

      return data.isResult || false;
    },
    async updateProduct(
      supplierId: string,
      productObjectId: string,
      topicId: string,
      detail: string) {
      const { status, data } = await axios.post<ResponseType>(
        `/api/v1/Suppliers/request/product/update/${supplierId}`,
        {
          productObjectId,
          topicId,
          detail,
        }
      );

      const toast = useToast();

      if (data.isResult) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }

      return data.isResult || false;
    },
    async fetchProductList(
      supplierId: string,
      page = 1,
      type: 'all' | 'last' | 'old' = 'all',
      companiescode: string | undefined = undefined) {
      const { data } = await axios.get<ApiResponseType<ProductType[]>>(
        `/api/v1/Suppliers/products/${supplierId}`,
        {
          params: {
            page,
            type,
            companiescode,
          },
        }
      );

      if (data.isResult) {
        this.list = {
          data: data.data,
          totalPage: data.pageCount === 0 ? 1 : data.pageCount,
        };
      } else {
        this.list = {
          data: [],
          totalPage: 0,
        };
        const toast = useToast();
        toast.error(data.message || 'Fetch product list failed');
        router.back();
      }
    },
    async fetchProductDetail(supplierId: string, productId: string) {
      const { data } = await axios.get<ApiResponseType<ProductDetailType>>(
        `/api/v1/Suppliers/products/detail/${supplierId}`,
        {
          params: {
            productid: productId,
          },
        }
      );

      if (data.isResult) {
        this.detail = data.data;
      } else {
        this.detail = null;
        const toast = useToast();
        toast.error(data.message || 'Fetch product detail failed');
        router.back();
      }
    },
    clearDetail() {
      this.detail = null;
    },
    clearList() {
      this.list = {
        data: [],
        totalPage: 0,
      };
    }
  },
});
