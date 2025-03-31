import { useContext, useRef, memo } from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { Popover } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import TopicSearch from '@/components/topicSearch';
import { AREA_PARK_ENTERPRISE_DETAIL } from '@/configs/localstorage';
import {
  MAffix,
  Export,
} from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/modules/main/functionRegion';
import useAddToDataView from '@/pages/area/areaF9/modules/regionalOverview/parkEnterprise/hooks/useAddToDataView';
import { formatNumberWithVIP } from '@/utils/format';

import IndustrialParkContext from '../../../context';
import MainContext from '../context';
import Filter from './filter';
export const loadingIcon = <LoadingOutlined style={{ fontSize: 12 }} spin />;
export const linkLoadingStyle = { marginRight: 4, display: 'inline-block' };

const FunctionRegion = ({ refs }: { refs: React.RefObject<HTMLDivElement> }) => {
  const filterRef = useRef(null);

  const { enterpriseParams } = useContext(IndustrialParkContext);

  const { count, condition, handleSearch } = useContext(MainContext);

  const { handleAddToEnterpriseDataView, loading } = useAddToDataView(condition);

  const { devZoneName } = enterpriseParams;

  return (
    <MAffix ref={refs}>
      <Container ref={filterRef}>
        <div className="left">
          <div className="filter">
            <Filter />
          </div>
          <div className="search">
            <TopicSearch
              placeholder="请输入园区企业名称"
              onClear={() => {
                handleSearch('');
              }}
              onSearch={handleSearch}
              dataKey={AREA_PARK_ENTERPRISE_DETAIL}
              focusedWidth={200}
              wrapperWidth={200}
            />
          </div>
        </div>
        <Right height={34}>
          <Popover
            trigger="hover"
            placement="bottom"
            overlayClassName="areaCompany-filter-popover"
            arrowPointAtCenter={true}
            color="rgba(255,255,255,1)"
            getPopupContainer={() => filterRef.current!}
            content={
              <div className="popover-content" onClick={handleAddToEnterpriseDataView}>
                导入当前列表企业至<span>企业数据浏览器</span>支持查询更多指标
              </div>
            }
          >
            <div className="more-indic" onClick={handleAddToEnterpriseDataView}>
              {loading ? (
                <div style={linkLoadingStyle}>
                  <Spin indicator={loadingIcon} />
                </div>
              ) : null}
              <span>更多指标</span>
              <div className="vip-icon" />
            </div>
          </Popover>
          <Operating>
            <div className="count">
              共<span>{formatNumberWithVIP(count, 0)}</span>条
            </div>
            <ExportDoc
              condition={{
                ...condition,
                module_type: 'region_park_enterprise_detail',
                exportFlag: 'true',
                isPost: true,
              }}
              filename={`${devZoneName}-园区企业明细-${dayjs(new Date()).format('YYYYMMDD')}`}
            />
          </Operating>
        </Right>
      </Container>
    </MAffix>
  );
};

export default memo(FunctionRegion);

const Container = styled.div`
  /* height: 36px; */
  display: flex;
  justify-content: space-between;
  background: #fff;
  .left {
    overflow: visible;
    height: auto;
    padding-top: 8px;
    position: relative;
    .filter {
      margin-bottom: 4px;
      margin-right: 13px;
      display: inline-block;
    }
    .search {
      display: inline-block;
      position: relative;
      top: -2px;
      .ant-input-affix-wrapper {
        height: 26px !important;
      }
    }
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

export const Right = styled.div`
  display: flex;
  align-items: center;
  height: ${({ height }: { height?: number }) => (height ? height + 'px' : '32px')};
  .more-indic {
    display: flex;
    align-items: center;
    margin-right: 24px;
    > span {
      display: inline-block;
      width: 52px;
      height: 20px;
      font-size: 13px;
      font-weight: 400;
      color: #262626;
      line-height: 21px;
      cursor: pointer;
    }

    .vip-icon {
      width: 12px;
      height: 11px;
      margin-left: 4px;
      background: url(${require('@/assets/images/area/vip.png')}) no-repeat;
      background-size: 100%;
      cursor: pointer;
    }
  }
`;

const Operating = styled(Export)`
  .count {
    span {
      color: #ff7500;
    }
  }
`;
