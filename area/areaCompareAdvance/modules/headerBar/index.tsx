import { memo, FC, useRef, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Checkbox } from 'antd';
import cn from 'classnames';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { getConfig } from '@/app';
import { Tooltip } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import Icon from '@/components/icon';
import { Screen } from '@/components/screen';
import { TransferSelect } from '@/components/transferSelectNew';
import { SingleSelectCheckbox } from '@/pages/area/areaCompareAdvance/components/singleSelectCheckbox';
import { YearConfig } from '@/pages/area/areaCompareAdvance/config';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import useHeaderData from '@/pages/area/areaCompareAdvance/hooks/useHeaderData';
import useRecord from '@/pages/area/areaCompareAdvance/hooks/useRecord';
import { flatDeepTree, flatDefaultIndexParam } from '@/pages/area/areaCompareAdvance/utils';

import Intro from './intro';

const IS_XINSIGHT_APP = getConfig((d) => d.platform.IS_XINSIGHT_APP);
interface IProps {
  traceCref: JSX.Element;
}

const grayColor = '#bfbfbf';

const HeaderBar: FC<IProps> = (props) => {
  const {
    state: { date, indexIds, isToolOpen, areaInfo, areaSelectCode, indicatorTree, isCompareHistory, isEmptyLineOpen },
    update,
  } = useCtx();
  const { traceCref } = props;

  const domRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const {
    handleYearChanged,
    indicatorList,
    handleIndicChange,
    /* checked,
    handleCheckChange,
    hasIndexIds, */
    areaChecked,
    handleAreaChange,
  } = useHeaderData();

  const { compareHistoryData } = useRecord();

  const onSelectCheckBoxChange = useMemoizedFn((select) => {
    const isOpenMax = select === 'max';
    const isOpenMin = select === 'min';
    update((d) => {
      d.isOpenMax = isOpenMax;
      d.isOpenMin = isOpenMin;
    });
  });

  const condition = useMemo(
    () => ({
      date,
      regionCodes: areaSelectCode,
      headName: flatDeepTree(indicatorTree)
        ?.map((o: any) => o.headName || o.title)
        .toString(),
      indexParamList: flatDefaultIndexParam(indicatorTree, indexIds, [date]),
    }),
    [areaSelectCode, date, indexIds, indicatorTree],
  );

  return (
    <HeaderWrap ref={domRef} isToolOpen={isToolOpen}>
      <div className="left-wrap">
        {date ? (
          <Screen
            values={[[date]]}
            options={YearConfig}
            onChange={handleYearChanged}
            getPopContainer={() => domRef.current || document.body}
          />
        ) : null}

        {
          /* hasIndexIds.current && */ indicatorList.length ? (
            <TransferSelect // check
              title="选择指标"
              data={indicatorList}
              checkMaxLimit={false}
              className="transfer-select"
              /* values={hasIndexIds.current ? indexIds : undefined} */
              moduleCode="dqdbgj"
              forbidEmptyCheck
              hideSaveTemplate
              pageCode=""
              onChange={handleIndicChange}
              getPopupContainer={() => domRef.current || document.body}
            />
          ) : null
        }
        <div
          className="select-area"
          onClick={() => {
            update((draft) => {
              draft.areaChangeIndex = -1;
              draft.selectAreaModalVisible = true;
            });
          }}
        >
          <span>选择地区</span>
          {/* <Icon image={require('../../imgs/expand2.png')} size={9} /> */}
        </div>
      </div>

      <div className="right-wrap" ref={filterRef}>
        {(!isEmpty(compareHistoryData) || isCompareHistory) && (
          <div
            className="record-history"
            onClick={() => {
              update((d) => {
                d.recordVisible = true;
              });
            }}
          >
            <Icon image={require('../../imgs/record.svg')} width={12} height={13} />
            <span>对比历史</span>
          </div>
        )}
        {/*  <div className="check-wrap">
          <Checkbox checked={checked} onChange={handleCheckChange}>
            <span className="text">记住指标</span>
          </Checkbox>
          <Tooltip
            color="#fff"
            arrowPointAtCenter
            placement="bottomLeft"
            // trigger={'click'}
            getPopupContainer={() => filterRef.current || document.body}
            title={() => <div className="remark-pop">记住指标开启后，会保留最后一次的筛选指标</div>}
          >
            <img className="update-help-img" src={require('@/assets/images/common/help.png')} alt="" />
          </Tooltip>
        </div> */}
        {IS_XINSIGHT_APP ? null : (
          <div className={cn('check-wrap', { 'disabled-area': !isToolOpen })}>
            <Checkbox checked={areaChecked} disabled={!isToolOpen} onChange={handleAreaChange}>
              <span className="text">记住地区</span>
            </Checkbox>
            <Tooltip
              color="#fff"
              arrowPointAtCenter
              placement="bottomLeft"
              getPopupContainer={() => filterRef.current || document.body}
              title={() => <div className="remark-pop">记住地区开启后，会保留最后一次查看的地区</div>}
            >
              <img className="update-help-img" src={require('@/assets/images/common/help.png')} alt="" />
            </Tooltip>
          </div>
        )}
        <SingleSelectCheckbox disabled={areaInfo?.length < 2} onSelectCheckBoxChange={onSelectCheckBoxChange} />

        <Checkbox
          className="hide-empty-line"
          checked={isEmptyLineOpen}
          disabled={!isToolOpen}
          onChange={(e) => {
            update((d) => {
              d.isEmptyLineOpen = e.target.checked;
            });
          }}
        >
          隐藏空行
        </Checkbox>
        {/* 溯源 */}
        {traceCref}
        <ExportDoc
          disabled={!isToolOpen}
          condition={{ ...condition, module_type: 'region_compare_tool', isPost: true, exportFlag: true }}
          filename={`区域对比工具-${dayjs(new Date()).format('YYYYMMDD')}`}
        />
        {/* 帮助 */}
        <Intro />
      </div>
    </HeaderWrap>
  );
};

export default memo(HeaderBar);

const HeaderWrap = styled.div<{ isToolOpen: boolean }>`
  height: 34px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left-wrap {
    display: flex;
    align-items: center;
    > .screen-wrapper {
      margin-right: 16px;
      .ant-dropdown-trigger {
        padding-top: 2px;
        padding-bottom: 0;
        margin-bottom: 0;
        font-size: 12px;
      }
    }
    .select-area {
      position: relative;
      display: flex;
      align-items: center;
      cursor: pointer;
      /* i {
        margin-top: 1px;
      } */
      span {
        font-size: 12px;
        font-weight: 400;
        color: #141414;
        margin: 2px 4px 0 0;
        cursor: pointer;

        &:hover {
          color: #0171f6;
        }
      }

      &::after {
        position: absolute;
        content: '';
        width: 9px;
        height: 9px;
        top: 7px;
        right: -8px;
        background: url(${require('../../imgs/expand2.png')}) no-repeat center;
        background-size: cover;
      }

      &:hover {
        &::after {
          top: 8px;
          background: url(${require('../../imgs/screen_expand.png')}) no-repeat center;
          background-size: cover;
          transform: rotate(180deg);
        }
      }
    }
    .transfer-select {
      margin-right: 16px;
      .selected-button {
        font-size: 12px;
        padding-bottom: 0;
      }
      .selected-template .ant-dropdown-trigger {
        font-size: 12px;
      }
    }
  }
  .right-wrap {
    display: flex;
    align-items: center;
    .record-history {
      display: flex;
      align-items: center;
      cursor: pointer;
      i {
        margin-top: 1px;
      }
      span {
        font-size: 12px;
        font-weight: 400;
        color: #141414;
        margin: 2px 16px 0 4px;
        cursor: pointer;

        &:hover {
          color: #0171f6;
        }
      }
    }
    .source-text {
      font-size: 12px !important;
    }
    .export-disable,
    .primary-hover {
      font-size: 12px;
      .iconfont {
        font-size: 15px;
      }
    }

    .check-wrap {
      height: 20px;
      margin-right: 16px;
      display: flex;
      align-items: center;
      .ant-checkbox {
        transform: scale(0.75);
        top: 4px;
        margin-right: 2px;
      }
      .ant-checkbox + span {
        padding-left: 0;
        padding-right: 0;
      }
      .text {
        display: inline-block;
        font-size: 12px;
        font-weight: 400;
        color: #141414;
        line-height: 20px;
      }
      .update-help-img {
        width: 12px;
        height: 12px;
        margin-left: 2px;
        /* margin-bottom: 4px; */
        cursor: pointer;
      }
    }
    .disabled-area {
      color: #333;
      opacity: 0.7;
    }
    .ant-checkbox {
      transform: scale(${12 / 16});
      transform-origin: left center;
      margin-left: 2px;
      overflow: hidden;

      &:after {
        display: none;
      }

      ~ span {
        font-size: 12px;
        color: #141414;
        padding-left: 4px;
      }

      &.ant-checkbox-disabled + span {
        color: #bfbfbf;
      }
    }
    .ant-tooltip-placement-bottomLeft {
      /* .ant-tooltip-arrow-content {
        width: 8px;
        height: 8px;
      } */
      .remark-pop {
        font-size: 12px;
        font-weight: 400;
        text-align: left;
        color: #262626;
        line-height: 18px;
        padding: 2px;
      }
    }
    .gray-text {
      color: ${grayColor};
      margin-right: 24px;
      font-size: 12px;
      cursor: not-allowed;
      .icon-arrow {
        display: inline-block;
        width: 7px;
        height: 7px;
        transform: translate(4px, -1px);
        background: url(${require('@/components/screen/images/icon_arrow.svg')}) no-repeat center / contain;
      }
    }
    .hide-empty-line {
      margin-right: 8px;
      .ant-checkbox {
        transform: scale(${12 / 16}) translateY(1.5px);
      }
      .ant-checkbox ~ span {
        padding-left: 0;
        margin-top: -2px;
      }
      .ant-checkbox-disabled + span {
        color: #333333;
        opacity: 0.7;
      }

      + div {
        margin-right: 16px;
      }
    }

    .trigger {
      i {
        width: 12px;
        height: 12px;
        background-image: url(${require('@/pages/area/areaCompareAdvance/imgs/why.svg')});
      }
      .txt {
        font-size: 12px;
        color: #141414;
      }
    }
  }
`;
