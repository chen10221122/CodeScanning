import { useEffect, useState } from 'react';

import { ScreenType } from '@dzh/screen';

import { useRequest } from '@/utils/hooks';

import { getSelectByModule, getHotClassificationData } from '../../api';
import { ModuleEnum } from '../../constant';
import { conditionType } from '../../index';

const SHOW_COUNT = 8; //地区默认展示前8个，剩余放入‘更多’

const TabFilterData = ({ moduleType, screenCondition }: { moduleType?: string; screenCondition: conditionType }) => {
  const [tabDataList, setTabDataList] = useState<any>([]); //热门类型tab 数据
  const [treeDataList, setTreeDataList] = useState<any>([]); //树组件弹框数据
  const [industryDataList, setIndustryDataList] = useState<any>([]); //行业属性（企业动态）
  const [industryList, setIndustryList] = useState<any>([]); //行业属性原始数据（企业动态）
  const [countMap, setCountMap] = useState<Record<string, any>>([]); //树组件数据类型统计

  const treeDataFilter = (dataArr: any) => {
    const resultData = dataArr.map((el: any) => {
      if (el.children?.length) el.children = treeDataFilter(el.children);
      return { ...el, id: el.value, key: 'swBusinessType' };
    });
    return resultData;
  };
  const { run: runSelect } = useRequest(getSelectByModule, {
    /**获取更多类型弹框数据 */
    manual: true,
    onSuccess: (data) => {
      let treeData = data.data?.filterTypeTree;
      if (moduleType === ModuleEnum.COMPANY) {
        setTreeDataList([{ children: treeData }]);
      } else if (moduleType === ModuleEnum.INDUSTRY) {
        const industryCfg = [
          {
            title: '',
            option: {
              formatTitle: () => '',
              type: ScreenType.MULTIPLE_THIRD,
              hasSelectAll: false,
              cascade: true,
              children: treeDataFilter(treeData),
            },
          },
        ];
        setIndustryDataList(industryCfg);
        setIndustryList(treeData);
      }
    },
  });
  const { run: runClassification } = useRequest(getHotClassificationData, {
    /**获取热门类型tab数据 */
    manual: true,
    onSuccess: (data) => {
      if (data.data.recommendNotice?.length) {
        let recommendNoticeData = data.data.recommendNotice.map((item: any) => ({
          ...item,
          count: item.num,
        }));
        if (moduleType !== ModuleEnum.AREA) {
          recommendNoticeData.push({
            name: moduleType === ModuleEnum.INDUSTRY ? '更多行业' : '更多类型',
            isMoreScreen: true,
          });
          setTabDataList([{ count: '', id: '', name: '不限' }, ...recommendNoticeData]);
        } else {
          const length = recommendNoticeData.length;
          let areaTabData = [];
          if (length > SHOW_COUNT) {
            areaTabData = recommendNoticeData.slice(0, SHOW_COUNT);
            areaTabData.push({
              name: '更多类型',
              isMoreScreen: true,
            });
            setTabDataList([{ count: '', id: '', name: '不限' }, ...areaTabData]);
            const industryCfg = [
              {
                title: '',
                option: {
                  formatTitle: () => '',
                  type: ScreenType.SINGLE,
                  hasSelectAll: false,
                  cascade: true,
                  children: recommendNoticeData
                    .slice(SHOW_COUNT, length)
                    .map((el: any) => ({ ...el, value: el.id, disabled: el.num === 0 })),
                },
              },
            ];
            setIndustryDataList(industryCfg);
          } else {
            setTabDataList([{ count: '', id: '', name: '不限' }, ...recommendNoticeData]);
          }
        }
      }
      setCountMap(data.data.treeStaticesNumMap);
    },
  });
  useEffect(() => {
    const requestParams = { ...screenCondition, moduleType };
    if (moduleType !== ModuleEnum.AREA) runSelect(requestParams);
    runClassification(requestParams);
  }, [screenCondition, moduleType, runSelect, runClassification]);
  return {
    tabDataList,
    treeDataList,
    countMap,
    industryDataList,
    industryList,
  };
};

export default TabFilterData;
