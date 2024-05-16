import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  CompanyStateType,
  CompanyType,
  CompanyDetailType,
  PackageListType,
  ResponseType,
} from '@/types/member';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';
import { router } from '@/router';

export const useCompanyStore = defineStore({
  id: 'CompanySupplier',
  state: (): CompanyStateType => ({
    list: {
      data: [],
      totalPage: 0,
    },
    detail: null,
    packages: [],
  }),
  getters: {
    getList(): CompanyType[] {
      return this.list.data;
    },
    getTotalPage(): number {
      return this.list.totalPage;
    },
    getDetail(): CompanyDetailType | null {
      return this.detail;
    },
    getPackages(): PackageListType[] {
      return this.packages;
    },
  },
  actions: {
    async addCompany(
      supplierId: string,
      logoFile: File,
      documentFile: File[],
      nameTH: string,
      nameEN: string,
      otherTH: string,
      otherEN: string,
      addressTH: string,
      addressEN: string,
      country: string,
      postCode: string,
      telephone: string,
      fax: string,
      email: string,
      website: string,
      contactDetail: string,
      natureTH: string,
      natureEN: string,
      packageId: string,
      social: { media: string; url: string }[]
    ) {
      const formData = new FormData();
      formData.append('logoFile', logoFile);
      documentFile.forEach((file) => {
        formData.append('documentFile', file);
      });
      formData.append('nameTH', nameTH);
      formData.append('nameEN', nameEN);
      formData.append('otherTH', otherTH);
      formData.append('otherEN', otherEN);
      formData.append('addressTH', addressTH);
      formData.append('addressEN', addressEN);
      formData.append('country', country);
      formData.append('postCode', postCode);
      formData.append('telephone', telephone);
      formData.append('fax', fax);
      formData.append('email', email);
      formData.append('website', website);
      formData.append('contactDetail', contactDetail);
      formData.append('natureTH', natureTH);
      formData.append('natureEN', natureEN);
      formData.append('packageId', packageId);
      social.forEach((item, index) => {
        formData.append(`social[${index}].media`, item.media);
        formData.append(`social[${index}].url`, item.url);
      });

      const { data } = await axios.post<ResponseType>(
        `/api/v1/Suppliers/request/companies/add/${supplierId}`,
        formData
      );

      const $toast = useToast();

      if (data.isResult) {
        $toast.success(data.message || 'Add company success');
      } else {
        $toast.error(data.message || 'Add company failed');
      }

      return data.isResult || false;
    },
    async addClaimCompany(
      supplierId: string,
      companyObjectId: string,
      detail: string,
      documentFile: File[]
    ) {
      const formData = new FormData();
      formData.append('companyObjectId', companyObjectId);
      formData.append('detail', detail);
      documentFile.forEach((file) => {
        formData.append('documentFile', file);
      });

      const { data } = await axios.post<ResponseType>(
        `/api/v1/Suppliers/request/claim/${supplierId}`,
        formData
      );

      const $toast = useToast();

      if (data.isResult) {
        $toast.success(data.message || 'Claim company success');
      } else {
        $toast.error(data.message || 'Claim company failed');
      }

      return data.isResult || false;
    },
    async fetchCompanyList(
      supplierId: string,
      page = 1,
      type: 'all' | 'last' | 'old' = 'all') {
      const { data } = await axios.get<ApiResponseType<CompanyType[]>>(
        `/api/v1/Suppliers/companies/${supplierId}`,
        {
          params: {
            page,
            type,
          },
        }
      );

      if (data.isResult) {
        this.list = {
          data: data.data,
          totalPage: data.pageCount === 0 ? 1 : data.pageCount,
        }
      } else {
        this.list = {
          data: [],
          totalPage: 0,
        };
        const toast = useToast();
        toast.error(data.message || 'Fetch company list failed');
        router.back();
      }
    },
    async fetchCompanyDetail(
      supplierId: string,
      companyId: string
    ) {
      const { data } = await axios.get<ApiResponseType<CompanyDetailType>>(
        `/api/v1/Suppliers/companies/detail/${supplierId}`,
        {
          params: {
            companyId,
          },
        }
      );

      if (data.isResult) {
        this.detail = data.data;
      } else {
        this.detail = null;
        const toast = useToast();
        toast.error(data.message || 'Fetch company detail failed');
        router.back();
      }
    },
    async fetchPackages(supplierId: string) {
      const { data } = await axios.get<ApiResponseType<PackageListType[]>>(
        `/api/v1/Suppliers/master/package/${supplierId}`
      );

      if (data.isResult) {
        this.packages = data.data;
      } else {
        const toast = useToast();
        toast.error(data.message || 'Fetch packages failed');
      }
    },
    async updateCompany(
      supplierId: string,
      companyObjectId: string,
      topicId: string,
      detail: string,
      packageId: string) {
      const { status, data } = await axios.post<ResponseType>(
        `/api/v1/Suppliers/request/companies/update/${supplierId}`,
        {
          companyObjectId,
          topicId,
          detail,
          packageId,
        }
      );

      const $toast = useToast();

      if (data.isResult) {
        $toast.success(data.message);
      } else {
        $toast.error(data.message);
      }

      return data.isResult || false;
    },
  },
});