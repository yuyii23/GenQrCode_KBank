import { defineStore } from 'pinia';
import axios from '@/utils/axios';
import type {
  ContentNewsType,
  newsStateType,
  newsResponseType,
  ContentNewHighLightType,
  newsType,
  newsDetailType,
} from '@/types/Application/';
import type { ApiResponseType } from '@/types/ApiResponseType';
import { useToast } from 'vue-toast-notification';
import { router } from '@/router';

export const useNewsStore = defineStore({
  id: 'News',
  state: (): newsStateType => {
    return {
      contentHighLight: null as ContentNewHighLightType | null,
      contentNewsList: [] as ContentNewsType[],
      bannerPathImages: '',
      bannerUrl: '',
      pageCount: 0,
      newHighLight: [] as newsType[],
      newHighLightPageCount: 0,
      newLists: [] as newsType[],
      newPageCount: 0,
      newsDetail: null,
    };
  },
  getters: {
    getContentNewsList(state): ContentNewsType[] {
      const newsList = state.contentNewsList;

      if (newsList.length < 5) {
        return newsList.concat(
          Array.from({ length: 5 - newsList.length }).map(() => {
            return {
              objectId: '',
              title: '',
              newsReleaseDate: '',
              sequence: '',
              pathImage: '',
            } as ContentNewsType;
          })
        );
      } else {
        return newsList;
      }
    },
    getContentHighLight(state): ContentNewsType | null {
      return state.contentHighLight;
    },
    getBanner(state): { bannerPathImages: string; bannerUrl: string } {
      return {
        bannerPathImages: state.bannerPathImages,
        bannerUrl: state.bannerUrl,
      };
    },
    getPageCount(state): number {
      return state.pageCount;
    },
    getNewHighLight(state): newsType[] {
      return state.newHighLight;
    },
    getNewHighLightPageCount(state): number {
      return state.newHighLightPageCount;
    },
    getNewsLists(state): newsType[] {
      return state.newLists;
    },
    getNewPageCount(state): number {
      return state.newPageCount;
    },
    getNewsDetail(state): newsDetailType | null {
      return state.newsDetail;
    },
  },
  actions: {
    async fetchContentNews(pageNumber = 1) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<newsResponseType>
        >('/api/v1/Contents/news', {
          params: {
            page: pageNumber,
          },
        });

        if (status === 200 && data.isResult) {
          const { highLight, newsList, bannerPathImages } = data.data;

          this.contentNewsList = newsList;
          this.contentHighLight = highLight;
          this.bannerPathImages = bannerPathImages;
          this.bannerUrl = data.data.bannerUrl;

          this.pageCount = data.pageCount;
        } else {
          toast.error(data.message || 'Fetch News List Error');
        }
      } catch (error) {
        toast.error('Fetch News List Error');
        console.log(error);
      }
    },
    async fetchNew(pageNumber = 1) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<ApiResponseType<newsType[]>>(
          '/api/v1/News',
          {
            params: {
              page: pageNumber,
            },
          }
        );

        if (status === 200 && data.isResult) {
          this.newLists = data.data;
          this.newPageCount = data.pageCount;
        } else {
          toast.error(data.message || 'Fetch News List Error');
        }
      } catch (error) {
        toast.error('Fetch News List Error');
        console.log(error);
      }
    },
    async fetchNewByFilter(filter: string, pageNumber = 1) {
      const toast = useToast();
      try {
        const { status, data } = await axios.get<ApiResponseType<newsType[]>>(
          `/api/v1/News/filter/${filter}`,
          {
            params: {
              page: pageNumber,
            },
          }
        );

        if (status === 200 && data.isResult) {
          this.newLists = data.data;
          this.newPageCount = data.pageCount;
        } else {
          toast.error(data.message || 'Fetch News List Error');
        }
      } catch (error) {
        toast.error('Fetch News List Error');
        console.log(error);
      }
    },
    async fetchNewHighLight(pageNumber = 1) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<ApiResponseType<newsType[]>>(
          '/api/v1/News/highlight',
          {
            params: {
              page: pageNumber,
            },
          }
        );

        if (status === 200 && data.isResult) {
          this.newHighLight = data.data;
          this.newHighLightPageCount = data.pageCount;
        } else {
          toast.error(data.message || 'Fetch News Highlight Error');
        }
      } catch (error) {
        toast.error('Fetch News Highlight Error');
        console.log(error);
      }
    },
    async fetchNewDetail(newsId: number) {
      const toast = useToast();
      try {
        const { data, status } = await axios.get<
          ApiResponseType<newsDetailType>
        >(`/api/v1/News/${newsId}`);

        if (status === 200 && data.isResult) {
          this.newsDetail = data.data;
        } else {
          toast.error(data.message || 'Fetch News Detail Error');
          router.back();
        }
      } catch (error) {
        toast.error('Fetch News Detail Error');
        console.log(error);
        router.back();
      }
    },
  },
});
