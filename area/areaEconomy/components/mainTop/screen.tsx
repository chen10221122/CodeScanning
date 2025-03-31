import { FC, useCallback, useState, memo, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import * as ls from 'local-storage';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { getCityInvestLimits } from '@/apis/bond/cityInvestMap';
import {
  ScreenType,
  Options,
  quickAreaOptions,
  RowItem,
  ScreenAreaTreeData,
  SingleThirdSearchScreen,
  DataOption,
  ThirdSelectRowItem,
} from '@/components/screen';
import { AREA_IS_CHANGE_STATUS, AREA_ECONOMY_AREA_TREE_DATA } from '@/configs/localstorage';
import { LINK_AREA_F9 } from '@/configs/routerMap';
import { useTrackMenuClick } from '@/libs/eventTrack';
import { useCtx } from '@/pages/area/areaEconomy/provider/getContext';
import { Dispatch } from '@/store';
import useRequest from '@/utils/ahooks/useRequest';
import { dynamicLink } from '@/utils/router';
import { recursion } from '@/utils/share';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';
const { getAllAreaTree } = quickAreaOptions;

const getParentNode = (list: any[], value: string) => {
  for (let i in list) {
    if (list[i].value === value) {
      return [list[i]];
    }
    if (list[i]?.children) {
      let node: any = getParentNode(list[i].children, value);
      if (node !== undefined) {
        return node.concat(list[i]);
      }
    }
  }
};

interface Props {
  code: string;
  getPopContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

interface SelectOptionItem {
  value: string;
  name: string;
  code: string;
  children?: SelectOptionItem[];
  prevCode: string[];
  disabled: boolean;
}

type ScreenAreaItemType = {
  wholeCode?: string;
  provinceSelf?: boolean;
  label: string;
  citySelf?: boolean;
} & ScreenAreaTreeData;

// 几个特殊地区禁止选中
// （海南省直辖县级行政区-469000；新疆维吾尔自治区直辖县级行政区划-659000；河南省县级行政区划-419000；湖北省直辖县级行政区划-429000）
const disabledAreaArr = ['419000', '429000', '469000', '659000'];

export const defaultSelectArea = { name: '全国', shortName: '全国', value: '100000', key: 1 };

const MulScreen: FC<Props> = ({ code, getPopContainer }) => {
  const {
    state: { areaTree: Tree },
    update,
  } = useCtx();
  const history = useHistory();
  const [data, setData] = useState<Options[]>([]);

  // 切换地区埋点
  const regionSwitchRef = useRef(null);
  const { trackMenuClick } = useTrackMenuClick();

  const handleData = useCallback((arr: any[], prevCode: string[] = []): SelectOptionItem[] => {
    if (Array.isArray(arr)) {
      return arr.map((item) => {
        const code = item?.regionCode ?? item.value;
        const newItem: SelectOptionItem = {
          code: code,
          disabled: disabledAreaArr.includes(code),
          prevCode: prevCode.concat(code),
          ...item,
        };
        if (Array.isArray(item?.children)) {
          newItem.children = handleData(newItem.children as any[], prevCode.concat(code));
        }

        return newItem;
      });
    }
    return [];
  }, []);

  const dispatch: Dispatch = useDispatch();

  useRequest(getAllAreaTree, {
    onSuccess(data: any) {
      ls.set(AREA_ECONOMY_AREA_TREE_DATA, data);
      setData([
        {
          title: '',
          option: {
            type: ScreenType.SINGLE_THIRD_AREA,
            children: handleData(data, []),
            isIncludingSameLevel: false,
          },
        },
      ]);
    },
    defaultParams: [false],
    formatResult: ({ data }: any) => {
      return recursion<ScreenAreaItemType>(data as ScreenAreaItemType[], (item) => {
        item.label = item.name;
        if (item.province || item.city) {
          const v = item.value;
          if (item.sameLevelValue) {
            item.value = v;
            item.wholeCode = v;
          }
          if (item.province) {
            delete item.province;
            item.provinceSelf = true;
          } else {
            delete item.city;
            item.citySelf = true;
          }
        }
      });
    },
  });

  // const [flag, setFlag] = useState(true);

  // 限制查询五个地区
  const { runAsync: handleLimits } = useRequest(getCityInvestLimits, {
    manual: true,
    formatResult: (res: any) => {
      // 处理非vip用户查看次数的提示内容
      if (res.info?.includes('该模块为VIP模块')) {
        const info = res.info.match(/该模块为VIP模块，已查询(\S*)\/天，提升等级可获更多权限/);
        if (info.length > 1) {
          dispatch.checkInfo.setRegionEconomyCheckInfo(`今日已查看${info[1]}`);
        }
      }
      return res;
    },
  });

  useEffect(() => {
    code && handleLimits({ code, pageCode: 'regionalEconomyQuickView' });
  }, [handleLimits, code]);

  // 科技型企业的数据处理
  const handleScientificChange = useMemoizedFn((current: RowItem[]) => {
    update((draft) => {
      if (isEmpty(current)) {
        draft.selectedAreaList = [defaultSelectArea];
      } else if (Tree && !isEmpty(current)) {
        const [item] = current;
        const list = getParentNode(Tree, item.value);
        if (!list) {
          draft.selectedAreaList = [item];
        } else {
          draft.selectedAreaList = list.sort((a: any, b: any) => a.key - b.key);
        }
      }
    });
  });

  const handleChange = useCallback(
    (cur?: ThirdSelectRowItem) => {
      handleScientificChange(cur ? [cur] : []);
      const code = cur?.code || '110000';
      handleLimits({ code, pageCode: 'regionalEconomyQuickView' })
        .then(() => {
          if (cur) {
            sessionStorage.setItem(AREA_IS_CHANGE_STATUS, '1');
            history.push(
              urlJoin(dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code }), urlQueriesSerialize({ code })),
            );
            setTimeout(() => {
              sessionStorage.removeItem(AREA_IS_CHANGE_STATUS);
            }, 4000);
          }
        })
        .catch((reason: any) => {
          if (reason?.returncode === 202 && reason.info?.includes('该模块今日查询次数已达上限')) {
            dispatch.checkInfo.setRegionEconomyCheckInfo('今日已查看5/5个地区');
            update((o) => {
              o.showPowerDialog = true;
            });
          }
        })
        .finally(() => {
          // 地区切换埋点  regionCode：code title:按钮名称
          trackMenuClick(regionSwitchRef.current, {
            regionCode: code,
            title: '确定',
          });
        });
    },
    [handleScientificChange, handleLimits, history, dispatch.checkInfo, update, trackMenuClick],
  );

  // 初始状态下根据 code 获取到科技型企业的初始状态
  useEffect(() => {
    if (code && Tree) {
      handleScientificChange([
        {
          name: '',
          value: code,
        },
      ]);
    }
  }, [Tree, code, handleScientificChange]);

  return (
    <Wrapper ref={regionSwitchRef} data-trace-from="regionSwitch">
      {data.length ? (
        <SingleThirdSearchScreen
          options={data as DataOption}
          onChange={handleChange}
          getPopContainer={getPopContainer}
          value={code}
        />
      ) : null}
    </Wrapper>
  );
};

export default memo(MulScreen);

const Wrapper = styled.div`
  width: 174px;
  margin: 0 0 0 7px;
  height: 26px;
  overflow: hidden;

  .ant-dropdown {
    transform: translateY(-10px);
  }
`;
