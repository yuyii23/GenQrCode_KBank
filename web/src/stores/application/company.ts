import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  companyListType,
  companyApiResponseType,
  companyStateType,
  companyDetailType,
  companyProfileType,
  companyInformationType,
  companyRelatedType,
  companyNewType,
  companyProductType,
  companyEventType,
  companyClassificationType,
  visibleCompaniesType,
  visibleMenuType,
  SubjectType,
  companiesSearchResultType,
} from '@/types/Application/';
import type { ApiResponseType } from '@/types/ApiResponseType';
import type { DropDownListType } from '@/types/DropDownListType';
import { useToast } from 'vue-toast-notification';
import { router } from '@/router';

export const useCompanyStore = defineStore('Company', {
  state: (): companyStateType => {
    return {
      newCompany: 0,
      totalCompany: 0,
      list: {
        data: [] as companyListType[],
        pageCount: 0,
      },
      detail: null,
      subject: [],
      searchResult: {
        pageCount: 0,
        totalCompanies: 0,
        resultLists: [],
      },
    };
  },
  getters: {
    getCompanyList(): companyListType[] {
      return this.list.data;
    },
    getPageCount(): number {
      return this.list.pageCount;
    },
    getNewCompany(): number {
      return this.newCompany;
    },
    getTotalCompany(): number {
      return this.totalCompany;
    },
    getProfile(): companyProfileType {
      return {
        imageBanner: this.detail?.imageBanner || '',
        imageLogo: this.detail?.imageLogo || '',
        nameTH: this.detail?.nameTH || '',
        nameEN: this.detail?.nameEN || '',
        website: this.detail?.website || '',
        email: this.detail?.email || '',
        telephone: this.detail?.telephone || '',
      };
    },
    getInformation(): companyInformationType {
      return {
        addressEN: this.detail?.addressEN || '',
        addressTH: this.detail?.addressTH || '',
        telephone: this.detail?.telephone || '',
        facebook: this.detail?.socialFacebook || '',
        line: this.detail?.socialLine || '',
        youtube: this.detail?.socialYoutube || '',
        instagram: null,
        tiktok: this.detail?.socialtiktok || '',
        twitter: this.detail?.socialtwiiter || '',
        linkedin: this.detail?.sociallinkin || '',
        video: this.detail?.vedioCompanies || '',
        saleDivisions: this.detail?.saleList || [],
        keyPersons: this.detail?.personList || [],
        certificates: this.detail?.certificateList || [],
        document: this.detail?.documentList,
      };
    },
    getBusinessClassification(): companyClassificationType[] {
      return this.detail?.classificationList || [];
    },
    getRelatedBrand(): companyRelatedType[] {
      return this.detail?.relatedList || [];
    },
    getProducts(): companyProductType[] {
      return this.detail?.productList || [];
    },
    getNews(): companyNewType[] {
      return this.detail?.newsList || [];
    },
    getEvents(): companyEventType[] {
      return this.detail?.eventList || [];
    },
    getProductClassification(): companyClassificationType[] {
      return this.detail?.productclassificationList || [];
    },
    getName(state) {
      return (language: 'TH' | 'EN'): string =>
        language === 'TH'
          ? state.detail?.nameTH || ''
          : state.detail?.nameEN || '';
    },
    getDetail(state) {
      return (language: 'TH' | 'EN'): string =>
        language === 'TH'
          ? state.detail?.natureofBizTH || ''
          : state.detail?.natureofBizEN || '';
    },
    getId(): string {
      return this.detail?.objectId || '';
    },
    getVisibleCompany(): visibleCompaniesType | undefined {
      return this.detail?.visibleCompanies;
    },
    getVisibleMenuType(): {
      name: string;
      url: string;
      value: string;
    }[] {
      const tagsFilterInformation = [] as {
        name: string;
        url: string;
        value: string;
      }[];

      if (this.detail?.visibleCompanies.visibleMenu.isInformation) {
        tagsFilterInformation.push({
          name: 'Information',
          url: '#information',
          value: 'information',
        });
      }
      if (this.detail?.visibleCompanies.visibleMenu.isBusinessClass) {
        tagsFilterInformation.push({
          name: 'Business Classification',
          url: '#business',
          value: 'business',
        });
      }
      if (this.detail?.visibleCompanies.visibleMenu.isRelatedBrand) {
        tagsFilterInformation.push({
          name: 'Related Brand',
          url: '#brand',
          value: 'brand',
        });
      }
      if (this.detail?.visibleCompanies.visibleMenu.isProduct) {
        tagsFilterInformation.push({
          name: 'Products & Services',
          url: '#services',
          value: 'services',
        });
      }
      if (this.detail?.visibleCompanies.visibleMenu.isNews) {
        tagsFilterInformation.push({
          name: 'News & Events',
          url: '#advs',
          value: 'advs',
        });
      }
      if (this.detail?.visibleCompanies.visibleMenu.isRelatedEvent) {
        tagsFilterInformation.push({
          name: 'Related Events',
          url: '#events',
          value: 'events',
        });
      }
      if (this.detail?.visibleCompanies.visibleMenu.isCategories) {
        tagsFilterInformation.push({
          name: 'Categories',
          url: '#categories',
          value: 'categories',
        });
      }
      return tagsFilterInformation;
    },
    getDropDownSubject(): DropDownListType[] {
      return this.subject.map((item) => ({
        value: item.code,
        title: item.name,
      }));
    },
    getSearchResult(): companyListType[] {
      return this.searchResult.resultLists;
    },
    getSearchPageCount(): number {
      return this.searchResult.pageCount;
    },
    getSearchTotal(): number {
      return this.searchResult.totalCompanies;
    },
    visibleMenu(): boolean {
      const visibleMenu =
        this.detail?.visibleCompanies.visibleMenu.isInformation ||
        this.detail?.visibleCompanies.visibleMenu.isBusinessClass ||
        this.detail?.visibleCompanies.visibleMenu.isRelatedBrand ||
        this.detail?.visibleCompanies.visibleMenu.isProduct ||
        this.detail?.visibleCompanies.visibleMenu.isNews ||
        this.detail?.visibleCompanies.visibleMenu.isRelatedEvent ||
        this.detail?.visibleCompanies.visibleMenu.isCategories;
      return visibleMenu || false;
    },
    visibleInformation(): boolean {
      const visibleInformation =
      this.detail?.visibleCompanies.isContact ||
      this.detail?.visibleCompanies.isSocialMedia ||
      this.detail?.visibleCompanies.isCertificate ||
      this.detail?.visibleCompanies.isVideo ||
      this.detail?.visibleCompanies.isSaleDivision ||
      this.detail?.visibleCompanies.isKeyPerson ||
      this.detail?.visibleCompanies.isDocument ||
      this.detail?.visibleCompanies.isAbout;
      return visibleInformation || false;
    },
    visibleListData(): boolean {
      const visibleListData =
      this.detail?.visibleCompanies.isClassification ||
      this.detail?.visibleCompanies.isCategory ||
      this.detail?.visibleCompanies.isProducts ||
      this.detail?.visibleCompanies.isNew ||
      this.detail?.visibleCompanies.isEvent ||
      this.detail?.visibleCompanies.isRelatedCategory;
      return visibleListData || false;
    }
  },
  actions: {
    async fetchCompanyList(page = 1) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<companyApiResponseType>
        >('/api/v1/Companies', {
          params: {
            page,
          },
        });

        if (status === 200 && data.isResult) {
          this.newCompany = data.data.newCompanies;
          this.totalCompany = data.data.totalCompanies;
          this.list = {
            data: data.data.companiesList,
            pageCount: data.pageCount,
          };
        } else {
          toast.error(data.message || 'Fetch company list failed');
        }
      } catch (error) {
        toast.error('Fetch company list failed');
        console.log(error);
      }
    },
    async fetchCompanyListByFilter(
      page: number,
      type: 'alpha' | 'text',
      filter: string
    ) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<companyListType[]>
        >(`/api/v1/Companies/${type}/${filter}`, {
          params: {
            page,
          },
        });

        if (status === 200 && data.isResult) {
          this.list = {
            data: data.data,
            pageCount: data.pageCount,
          };
        } else {
          toast.error(data.message || 'Fetch company list failed');
        }
      } catch (error) {
        toast.error('Fetch company list failed');
        console.log(error);
      }
    },
    async fetchCompanyDetail(objectId: string) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<companyDetailType>
        >(`/api/v1/Companies/${objectId}`);

        if (status === 200 && data.isResult) {
          this.detail = data.data;
        } else {
          toast.error(data.message || 'Fetch company detail failed');
          router.back();
        }
      } catch (error) {
        toast.error('Fetch company detail failed');
        console.log(error);
        router.back();
      }
    },
    async fetchCompanySubject() {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<SubjectType[]>
        >('/api/v1/Companies/parameter/subject');

        if (status === 200 && data.isResult) {
          this.subject = data.data;
        } else {
          toast.error(data.message || 'Fetch company subject failed');
        }
      } catch (error) {
        toast.error('Fetch company subject failed');
        console.log(error);
      }
    },
    async fetchSearchCompanyByFilter(page: number, filter: string) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<companiesSearchResultType>
        >(`/api/v1/Filter/Companies/${filter}`, { params: { page } });

        if (status === 200 && data.isResult) {
          this.searchResult = {
            pageCount: data.pageCount,
            totalCompanies: data.data.totalCompanies,
            resultLists: data.data.resultList,
          };
        } else {
          toast.error(data.message || 'Fetch search company failed');
        }
      } catch (error) {
        toast.error('Fetch search company failed');
        console.log(error);
      }
    },
    async sendContact(
      objectId: string,
      name: string,
      email: string,
      subjectId: string,
      message: string,
      memberId: string | undefined = undefined
    ) {
      const toast = useToast();
      try {
        const { data, status } = await axios.post<ApiResponseType<null>>(
          '/api/v1/Contact',
          {
            objectId,
            name,
            email,
            subjectId,
            message,
            memberId,
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
