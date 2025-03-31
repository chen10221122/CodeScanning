import { useContext, useRef, useMemo, memo, useState } from 'react';

import { useSize, useMemoizedFn } from 'ahooks';
import { Spin } from 'antd';
import dayjs from 'dayjs';
import { omit } from 'lodash';

import NoPayDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { Popover } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import TopicSearch from '@/components/topicSearch';
import { AREA_PARK_ENTERPRISE } from '@/configs/localstorage';
import { useSelector } from '@/pages/area/areaF9/context';
import {
  MAffix,
  Export,
  Container,
  ResetButton,
} from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/modules/main/functionRegion';
import {
  Right,
  loadingIcon,
  linkLoadingStyle,
} from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/modules/modal/functionRegion';
import { DialogContentStyle } from '@/pages/full/financingInstitution/modules/chineseFundAssociation/components/moreFile';
import { formatNumberWithVIP } from '@/utils/format';

import ParkContext from '../context';
import useAddToDataView from '../hooks/useAddToDataView';
import { originCondition } from '../hooks/useList';
import Filter from './filter';

const selectList = Object.keys(omit(originCondition, ['from', 'page', 'size', 'sortKey', 'sortRule', 'parkFlag']));

const FunctionRegion = ({ refs }: { refs: React.RefObject<HTMLDivElement> }) => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const [noPayDialog, setNoPayDialog] = useState(false);
  const havePay = useSelector((store: any) => store.havePay);

  const filterRef = useRef(null);
  const filterWrapperRef = useRef(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const { width } = useSize(searchWrapperRef) || { width: 80 };

  const { width: filterWidth } = useSize(filterRef) || { width: 1026 };

  const { width: filterLeftWidth } = useSize(filterWrapperRef) || { width: 478 };

  const { count, condition, handleSearch, handleReset } = useContext(ParkContext);

  const { handleAddToEnterpriseDataView, loading } = useAddToDataView(condition);

  const onClickJump = useMemoizedFn(() => {
    if (!havePay) {
      setNoPayDialog(true);
      return;
    }
    handleAddToEnterpriseDataView();
  });

  /* 290：右侧最大宽度 */
  const surplusWidth = filterWidth - filterLeftWidth - 286;

  /* 343：搜索+重置宽度 */
  const surplus = surplusWidth > 343;

  const selectStatus = useMemo(() => {
    let status = false;
    selectList.forEach((o) => {
      //@ts-ignore
      if (condition[o]) {
        status = true;
      }
    });

    return status;
  }, [condition]);

  /* 搜索是否展开 */
  const focus = width > 100;

  return (
    <>
      <MAffix ref={refs}>
        <Container ref={filterRef} surplus={surplus}>
          <div className="left">
            <div className="filter" ref={filterWrapperRef}>
              <Filter />
            </div>
            <div style={{ display: 'inline-block', width: surplus ? 0 : surplusWidth - 2 }}></div>
            <div className="search" ref={searchWrapperRef} style={{ marginRight: focus ? 20 : 0, marginBottom: 2 }}>
              <TopicSearch
                placeholder="请输入园区企业名称、园区名称"
                onClear={() => {
                  handleSearch('');
                }}
                onSearch={handleSearch}
                dataKey={AREA_PARK_ENTERPRISE}
                focusedWidth={240}
                wrapperWidth={80}
              />
            </div>
            {selectStatus ? <ResetButton onClick={handleReset}>重置</ResetButton> : null}
          </div>
          <Right>
            <Popover
              trigger="hover"
              placement="bottom"
              overlayClassName="areaCompany-filter-popover"
              arrowPointAtCenter={true}
              color="rgba(255,255,255,1)"
              getPopupContainer={() => filterRef.current!}
              content={
                <div className="popover-content" onClick={onClickJump}>
                  导入当前列表企业至<span>企业数据浏览器</span>支持查询更多指标
                </div>
              }
            >
              <div className="more-indic" onClick={onClickJump}>
                {loading ? (
                  <div style={linkLoadingStyle}>
                    <Spin indicator={loadingIcon} />
                  </div>
                ) : null}
                <span>更多指标</span>
                <div className="vip-icon" />
              </div>
            </Popover>
            <Export>
              <div className="count">
                共<span>{formatNumberWithVIP(count, 0)}</span>条
              </div>
              <ExportDoc
                condition={{
                  ...condition,
                  module_type: 'region_park_enterprise',
                  exportFlag: 'true',
                  isPost: true,
                }}
                filename={`${areaInfo?.regionName}-园区企业-${dayjs(new Date()).format('YYYYMMDD')}`}
              />
            </Export>
          </Right>
        </Container>
      </MAffix>
      <NoPayDialog
        visible={noPayDialog}
        setVisible={() => {
          setNoPayDialog(false);
        }}
        type
        customMsgTxt="开通VIP可使用该功能：一键导入当前列表企业至企业数据浏览器，支持查询更多指标"
      >
        <DialogContentStyle />
      </NoPayDialog>
    </>
  );
};

export default memo(FunctionRegion);
