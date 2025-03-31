import { memo, useEffect, useMemo, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { useTabApp } from '@/app/utils/hooks';
import { Screen, ScreenType, quickAreaOptions, RowItem } from '@/components/screen';
import { LINK_TECHNOLOGY_ENTERPRISE } from '@/configs/routerMap';
import useRequest from '@/utils/ahooks/useRequest';
import { dynamicLink } from '@/utils/router';
import { urlJoin } from '@/utils/url';

import { getAreaOrChildByRegionCode } from '../../api';
import AreaIcon from '../../image/area.webp';
import changeArea from '../../image/areaChange.png';
import arrowRight from '../../image/arrowRight.png';
import Point from '../../image/pointer@2x.webp';
import { useCtx, defaultSelectArea } from '../../provider/ctx';

const { /**getAllAreaTree, */ onSearch } = quickAreaOptions;

/**
 * 带面包屑的地区筛选
 */
export default memo(() => {
  const {
    state: { selectedAreaList, areaTree: Tree, enterpriseStatus },
    update,
  } = useCtx();
  const { remove } = useTabApp();
  const screenRef = useRef(null);
  const areaTree = useRef();

  const history = useHistory();
  const link = useMemoizedFn((): void => {
    remove();
    history.push(urlJoin(dynamicLink(LINK_TECHNOLOGY_ENTERPRISE)), '');
  });

  const { data, loading, run } = useRequest(getAreaOrChildByRegionCode, {
    // cacheKey: `techEnterpriseTopAreaOption_${enterpriseStatus}`,
    formatResult(res: any) {
      const optionArr = res.data as any;
      optionArr.unshift({ key: 1, name: '全国', value: '100000', children: null });
      areaTree.current = optionArr;
      return enterpriseStatus === 1
        ? [
            {
              title: '',
              option: {
                type: ScreenType.SINGLE_THIRD_AREA,
                //prevCode和prevName的初始值就是全国
                children: [...optionArr],
                isIncludingSameLevel: false,
                onSearch,
              },
            },
          ]
        : [
            {
              title: '全国',
              formatTitle: (row: any) => {
                return row?.[0]?.name;
              },
              ellipsis: 20,
              option: {
                type: ScreenType.SINGLE_THIRD_AREA,
                //prevCode和prevName的初始值就是全国
                children: [...optionArr],
                isIncludingSameLevel: false,
                onSearch,
              },
            },
          ];
    },
  });

  const currentSelectedCode = useMemo(() => {
    if (selectedAreaList && selectedAreaList[0]?.value !== '100000') {
      return selectedAreaList.slice(-1)?.[0].value;
    } else {
      return '100000';
    }
  }, [selectedAreaList]);

  const handleChange = useMemoizedFn((current: RowItem[]) => {
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

  useEffect(() => {
    run();
  }, [run, enterpriseStatus]);

  const itemClicked = useMemoizedFn((i) => {
    update((draft) => {
      if (!isEmpty(areaTree.current)) {
        const list = getParentNode(areaTree.current!, i.value);
        if (!list) {
          draft.selectedAreaList = [i];
        } else {
          draft.selectedAreaList = list.sort((a: any, b: any) => a.key - b.key);
        }
      }
    });
  });

  return (
    <AreaScreenWapper enterpriseStatus={enterpriseStatus} ref={screenRef}>
      <div className="breadCrumbs">
        {selectedAreaList && !isEmpty(selectedAreaList) && enterpriseStatus === 1 ? (
          selectedAreaList.map((i, idx, arr) => {
            const hasClickEventAndHighLight = (() => {
              if (!(idx + 1 === arr.length)) {
                return true;
              } else {
                return i.value === '10000';
              }
            })();
            return (
              <BreadCrumbs
                key={idx}
                hasNext={hasClickEventAndHighLight}
                onClick={() => (hasClickEventAndHighLight ? itemClicked(i) : void 0)}
              >
                {i.name}
              </BreadCrumbs>
            );
          })
        ) : enterpriseStatus === 2 ? (
          <>
            <BreadCrumbs
              key={'科技型企业首页'}
              hasNext={true}
              onClick={() => {
                link();
              }}
            >
              科技型企业首页
            </BreadCrumbs>
            <BreadCrumbs key={'被撤销科技型企业'} hasNext={false}>
              被撤销科技型企业
            </BreadCrumbs>
          </>
        ) : null}
      </div>
      {!loading && !isEmpty(data) ? (
        <Screen
          options={data}
          onChange={handleChange}
          getPopContainer={() => screenRef.current || document.body}
          values={[[currentSelectedCode]]}
        ></Screen>
      ) : null}
    </AreaScreenWapper>
  );
});

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

const BreadCrumbs = styled.span<{ hasNext?: boolean }>`
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  /* display: inline-block; */
  color: #0171f6;
  line-height: 23px;
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;
  ${({ hasNext }) => {
    return hasNext
      ? `
        &::after {
          content: '';
          width: 14px;
          height: 14px;
          display: inline-block;
          color: #D0D0D0;
          font-size: 10px;
          line-height: 23px;
          margin: 0 4px;
          &:hover{
            text-decoration: none;
          }
          background: url(${arrowRight}) no-repeat;
          image-rendering: -webkit-optimize-contrast;
          background-size: 100% auto;
        }
        cursor: pointer;
        &:hover{
          text-decoration: underline;
        }
      `
      : `
        color: #141414;
      `;
  }}
`;

const AreaScreenWapper = styled.div<{ enterpriseStatus: 1 | 2 }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .breadCrumbs {
  }

  /* .screen-wrapper{
    .ant-dropdown-trigger {
      display: none !important;
    }
  } */

  ${({ enterpriseStatus }) => {
    return enterpriseStatus === 1
      ? `
      .ant-dropdown-trigger {
        margin-left: 10px;
        width: 76px;
        height: 22px;
        background: url(${changeArea}) no-repeat;
        background-size: 100% 100%;
        > span > i {
          display: none !important;
        }
      }
      `
      : `
      .ant-dropdown-trigger{
        /* width: 76px; */
        height: 22px;
        margin-left: 10px;
        background-color: #fff;
        border: 1px solid #f2f2f2;
        border-radius: 11px;
        padding: 1px 7px 0 21px !important;
        > span > i {
          display: none !important;
        }
        background: url(${Point}) no-repeat;
        background-size: 14px 14px;
        background-position: 6px 3px;
      }
      `;
  }}

  /** .ant-dropdown-trigger {
   display: none;
    margin-left: 0px;
    height: 34px;
    width: 40px;
    padding: 0 24px 0 0px;
    font-size: 13px;
    font-weight: 400;
    color: #262626 !important;
    background: url(${require('@/assets/images/bond/change_region.svg')}) no-repeat;
    background-size: 40px 34px;
    &:hover {
      color: #262626 !important;
    }
    > span > i {
      display: none !important;
    }
  } */

  .areaSelector {
    width: 76px;
    height: 22px;
    border: 1px solid #f2f2f2;
    border-radius: 11px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .icon {
      width: 14px;
      height: 14px;
      display: inline-block;
      background: url('${AreaIcon}') no-repeat;
      background-size: 100% 100%;
    }
    .changeArea {
      font-size: 12px;
      font-weight: 400;
      text-align: left;
      color: #262626;
      line-height: 22px;
      padding-left: 2px;
    }
  }
`;
