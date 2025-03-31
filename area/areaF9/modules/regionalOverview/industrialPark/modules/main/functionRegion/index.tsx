import { useContext, useRef } from 'react';

import { useSize } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import ExportDoc from '@/components/exportDoc';
import TopicSearch from '@/components/topicSearch';
import { AREA_INDUSTRIAL_PARK } from '@/configs/localstorage';
import { useSelector } from '@/pages/area/areaF9/context';
import { formatNumberWithVIP } from '@/utils/format';

import MainContext from '../context';
import Filter from './filter';

const FunctionRegion = ({ selectStatus }: { selectStatus: boolean }) => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));

  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const { count, condition, handleSearch, handleReset } = useContext(MainContext);

  const { width } = useSize(searchWrapperRef) || { width: 80 };

  const focus = width > 100;

  return (
    <MAffix>
      <Container>
        <div className="left">
          <div className="filter">
            <Filter />
          </div>
          <div className="search" ref={searchWrapperRef} style={{ marginRight: focus ? 24 : 0 }}>
            <TopicSearch
              placeholder="请输入园区名称"
              onClear={() => {
                handleSearch('');
              }}
              onSearch={handleSearch}
              dataKey={AREA_INDUSTRIAL_PARK}
              focusedWidth={200}
              wrapperWidth={80}
            />
          </div>
          {selectStatus ? <ResetButton onClick={handleReset}>重置</ResetButton> : null}
        </div>
        <div className="right">
          <Export>
            <div className="count">
              共<span>{formatNumberWithVIP(count, 0)}</span>条
            </div>
            <ExportDoc
              condition={{
                ...condition,
                module_type: 'region_enterprise_park',
                exportFlag: 'true',
                isPost: true,
              }}
              filename={`${areaInfo?.regionName}-产业园区-${dayjs(new Date()).format('YYYYMMDD')}`}
            />
          </Export>
        </div>
      </Container>
    </MAffix>
  );
};

export default FunctionRegion;

export const MAffix = styled.div`
  position: sticky;
  z-index: 5;
  top: 0;
`;

export const Container = styled.div<{ surplus?: boolean }>`
  /* height: 36px; */
  display: flex;
  justify-content: space-between;
  background: #fff;
  .left {
    overflow: visible;
    height: auto;
    padding-top: 5px;
    position: relative;
    .filter {
      margin-bottom: 5px;
      display: inline-block;
    }
    .search {
      margin-left: ${({ surplus = true }) => (surplus ? '13px' : '0')};
      display: inline-block;
      position: relative;
      top: -2px;
      .ant-input-affix-wrapper {
        height: 26px !important;
      }
    }
  }
  .right {
    height: 32px;
    display: flex;
    align-items: center;
  }
  .areaCompany-filter-popover {
    .ant-popover-inner-content {
      width: 250px;
      height: 54px;
      padding: 8px 10px;
      box-shadow: 0px 2px 9px 2px rgba(0, 0, 0, 0.09), 0px 1px 2px -2px rgba(0, 0, 0, 0.16);
    }
    .popover-content {
      font-size: 13px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #434343;
      > span {
        margin: 0 16px 0 6px;
        color: #025cdc;
        cursor: pointer;
      }
    }
  }
`;

export const Export = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  white-space: nowrap;
  .count {
    font-size: 13px;
    color: #8c8c8c;
    margin-right: 24px;
    span {
      color: #333333;
      padding: 0 4px;
    }
  }
`;

export const ResetButton = styled.div`
  width: 26px;
  height: 20px;
  font-size: 13px;
  color: #ff7500;
  line-height: 20px;
  margin: 0 40px 6px 0;
  display: inline-block;
  cursor: pointer;
`;
