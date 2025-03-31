import { memo, useCallback, useEffect, useRef, useState, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import NoPayDialog from '@/app/components/dialog/power/noPayCreatLimit';
import indicators from '@/pages/bond/areaFinancingPlatform/components/filter/indicator';
import Popup from '@/pages/bond/areaFinancingPlatform/components/popup';
import useBriefing from '@/pages/bond/areaFinancingPlatform/useBriefing';
import { maxDataType } from '@/pages/bond/areaFinancingPlatform/useFinancingPlateform';

import { PAGE_SIZE } from '../../../config/platforms';
import Table from './table_source';

import styles from '@/pages/bond/areaFinancingPlatform/styles.module.less';

interface CityData {
  id: number;
  cityCode: number;
  cityName: string;
}

/** 头部高度 */
const HEADER_HEIGHT = 36;
/** 筛选高度 */
const FILTER_HEIGHT = 36;

interface IProps {
  maxData: maxDataType;
  [key: string]: any;
}
const MyTable = ({
  onTableChange,
  maxData,
  count,
  tableData,
  currentPage,
  onSortChange,
  setCurrentSort,
  currentSort,
  error,
  searchKey,
}: IProps) => {
  const [selectData, setSelectData] = useState<CityData>({ id: -1, cityCode: -1, cityName: '' });

  const [tabIndex, setTabIndex] = useState(0);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [category, setCategory] = useState(0);

  useEffect(() => {
    const e = error as any;
    if (e?.returncode === 202) {
      setShowLimitDialog(true);
      // setErrors({
      //   visible: true,
      //   desc: e.info,
      // });
    }
  }, [error, setShowLimitDialog]);
  //查看某条数据-将公司信息返回
  const getChildrenMsg = useMemoizedFn((index: number, tabIndex?: number, tabIndex_index?: number) => {
    setSelectData(tableData[index]);
    if (isUndefined(tabIndex)) {
      setTabIndex(0);
    } else {
      setTabIndex(tabIndex);
    }
    if (isUndefined(tabIndex_index)) {
      setCategory(0);
    } else {
      setCategory(tabIndex_index);
    }
  });

  //关闭弹层
  const closePop = useCallback(() => {
    setSelectData({ id: -1, cityCode: -1, cityName: '' });
  }, [setSelectData]);

  const wrapper = useRef<HTMLDivElement>(null);

  const tableWrapper = useRef<HTMLDivElement>(null);
  const [isScrollHide, setScrollbarHide] = useState(false);

  useEffect(() => {
    if (tableData) {
      if (wrapper.current && tableWrapper.current) {
        const tableContainerHeight = wrapper.current.offsetHeight - HEADER_HEIGHT - FILTER_HEIGHT;
        const tableHeight = tableWrapper.current.offsetHeight;

        setScrollbarHide(tableHeight <= tableContainerHeight);
      }
    }
  }, [tableData]);

  // 下载简报
  const currRaw = useRef();
  const { handleDownloadBriefing, loading } = useBriefing(currRaw);

  const stick = useMemo(
    () => ({
      offsetHeader: 114,
      getContainer: () => document.getElementById('tabsWrapper') || window,
    }),
    [],
  );

  const options = useMemo(() => {
    let list = indicators.reduce((prev: any[], curr: any) => {
      if (curr?.children?.length) {
        return [...prev, ...curr.children];
      }
      return prev;
    }, []);
    return list.filter((item: any) => item.active);
  }, []);
  return (
    <Wrap>
      <div ref={wrapper}>
        <NoPayDialog visible={showLimitDialog} setVisible={setShowLimitDialog} type={`areaFinancingPlatform`} />

        <div ref={tableWrapper}>
          <Table
            downloadLoading={loading}
            handleDownload={handleDownloadBriefing}
            currentSort={currentSort}
            setCurrentSort={setCurrentSort}
            handleSortChange={onSortChange}
            curentPage={currentPage}
            isScrollbarHide={isScrollHide}
            data={tableData}
            total={count}
            sticky={stick}
            indicators={options}
            getChildrenMsg={getChildrenMsg}
            paginationSize={PAGE_SIZE}
            onChange={onTableChange as any}
            searchKey={searchKey}
            maxData={maxData}
          />
        </div>

        <div className={styles.areaFinancingPlateform}>
          <div>
            {selectData.id !== -1 ? (
              <Popup data={selectData} closePop={closePop} tabIndex={tabIndex} tabIndex_index={category} />
            ) : null}
          </div>
        </div>
      </div>
    </Wrap>
  );
};

export default memo(MyTable);

const Wrap = styled.div`
  #areaFinancingPlatformTableDom {
    padding: 0 !important;
  }
`;
