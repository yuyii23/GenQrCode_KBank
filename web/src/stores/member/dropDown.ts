import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  DropDownStateType,
  TopicProductType,
  TopicCompanyType,
  TopicAdvertisementType,
  CompaniesType,
} from '@/types/member';
import type { ApiResponseType } from '@/types/ApiResponseType';
import type { DropDownListType } from '@/types/DropDownListType';
import { useToast } from 'vue-toast-notification';

export const useDropDownStore = defineStore({
  id: 'DropDownStore',
  state: (): DropDownStateType => ({
    topicProducts: [],
    topicCompanies: [],
    topicAdvertisements: [],
    companies: [],
    positions: [],
    sections: [],
    periods: [],
    countries: [],
  }),
  getters: {
    getTopicProducts(): DropDownListType[] {
      return this.topicProducts.map((topic) => ({
        value: topic.code,
        title: topic.name,
      }));
    },
    getTopicCompanies(): DropDownListType[] {
      return this.topicCompanies.map((topic) => ({
        value: topic.code,
        title: topic.name,
      }));
    },
    getTopicCompaniesByCode(state) {
      return (code : string) => {
        return state.topicCompanies.find((item) => item.code === code);
      }
    },
    getTopicAdvertisements(): DropDownListType[] {
      return this.topicAdvertisements.map((topic) => ({
        value: topic.code,
        title: topic.name,
      }));
    },
    getCompanies(): DropDownListType[] {
      return this.companies.map((company) => ({
        value: company.code,
        title: company.name,
      }));
    },
    getAllCompanies(): DropDownListType[] {
      let dropDownList = [{
        value: '',
        title: 'All Company',
      }] as DropDownListType[];

      return dropDownList.concat(this.companies.map((company) => ({
        value: company.code,
        title: company.name,
      })));
    },
    getSections(): DropDownListType[] {
      return this.sections.map((section) => ({
        value: section.code,
        title: section.name,
      }));
    },
    getPositions(): DropDownListType[] {
      return this.positions.map((position) => ({
        value: position.code,
        title: position.name,
      }));
    },
    getPeriods(): DropDownListType[] {
      return this.periods.map((period) => ({
        value: period.code,
        title: period.name,
      }));
    },
    getCountries(): DropDownListType[] {
      return this.countries.map((country) => ({
        value: country.code,
        title: country.name,
      }));
    },
  },
  actions: {
    async fetchTopicProducts(supplierId: string, action: 'add' | 'update') {
      const { data } = await axios.get<ApiResponseType<TopicProductType[]>>(
        `/api/v1/Suppliers/request/master/topic/${supplierId}/product`,
        {
          params: {
            action,
          },
        }
      );

      this.topicProducts = data.data;

      const toast = useToast();

      if (!data.isResult) {
        toast.error(data.message || 'Fetch topic product failed');
      }
    },
    async fetchTopicCompanies(supplierId: string, action: 'add' | 'update') {
      const { data } = await axios.get<ApiResponseType<TopicCompanyType[]>>(
        `/api/v1/Suppliers/request/master/topic/${supplierId}/companies`,
        {
          params: {
            action,
          },
        }
      );

      this.topicCompanies = data.data;

      const toast = useToast();
      if (!data.isResult) {
        toast.error(data.message || 'Fetch topic company failed');
      }
    },
    async fetchTopicAdvertisements(supplierId: string, action: 'add' | 'update') {
      const { data } = await axios.get<ApiResponseType<TopicAdvertisementType[]>>(
        `/api/v1/Suppliers/request/master/topic/${supplierId}/ads`,
        {
          params: {
            action,
          },
        }
      );

      this.topicAdvertisements = data.data;

      const toast = useToast();
      if (!data.isResult) {
        toast.error(data.message || 'Fetch topic advertisement failed');
      }
    },
    async fetchCompanies(supplierId: string) {
      const { data } = await axios.get<ApiResponseType<CompaniesType[]>>(
        `/api/v1/Suppliers/master/companies/${supplierId}`);

      this.companies = data.data;

      const toast = useToast();
      if (!data.isResult) {
        toast.error(data.message || 'Fetch companies failed');
      }
    },
    async fetchSections() {
      const { data } = await axios.get<ApiResponseType<CompaniesType[]>>(
        `/api/v1/Suppliers/master/section`);

      this.sections = data.data;

      const toast = useToast();
      if (!data.isResult) {
        toast.error(data.message || 'Fetch sections failed');
      }
    },
    async fetchPositions(section: string) {
      const { data } = await axios.get<ApiResponseType<CompaniesType[]>>(
        `/api/v1/Suppliers/master/postion`, {
        params: {
          section,
        },
      });

      this.positions = data.data;

      const toast = useToast();
      if (!data.isResult) {
        toast.error(data.message || 'Fetch positions failed');
      }
    },
    async fetchPeriods(supplierId: string) {
      const { data } = await axios.get<ApiResponseType<CompaniesType[]>>(
        `/api/v1/Suppliers/master/ads/period/${supplierId}`);

      this.periods = data.data;

      const toast = useToast();
      if (!data.isResult) {
        toast.error(data.message || 'Fetch periods failed');
      }
    },
    async fetchCountries() {
      const { data } = await axios.get<ApiResponseType<CompaniesType[]>>(
        `/api/v1/Suppliers/master/country`);

      this.countries = data.data;

      const toast = useToast();
      if (!data.isResult) {
        toast.error(data.message || 'Fetch countries failed');
      }
    },
  },
});

