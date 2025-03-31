import { getAreaSideBarOption, getIndustryInfo } from '@/pages/area/areaCompany/api/screenApi';
import { useDispatch } from '@/pages/area/areaF9/context';
import useRequest from '@/utils/ahooks/useRequest';

export const useGetAreaOptions = () => {
  const dispatch = useDispatch();

  /** 获取地区树 */
  const { data: areaData } = useRequest(getAreaSideBarOption, {
    formatResult(res: { data: any }) {
      return res?.data?.map((i: any) => {
        return { ...i, key: 1 };
      });
    },
    onSuccess: (res) => {
      dispatch((d) => {
        d.areaTree = res;
        d.areaTreeLoading = false;
      });
    },
    onError: () => {
      dispatch((d) => {
        d.areaTreeLoading = false;
      });
    },
  });

  /** 区域企业页面-获取国标行业筛选项 */
  const {
    data: industryInfo,
    // error: industryError,
  } = useRequest(getIndustryInfo, {
    formatResult(res: { data: any }) {
      return res?.data;
    },
    onSuccess: (res) => {
      dispatch((d) => {
        d.industryInfo = res;
        d.industryLoading = false;
      });
    },
    onError: () => {
      dispatch((d) => {
        d.industryLoading = false;
      });
    },
  });

  return { areaData, industryInfo };
};
