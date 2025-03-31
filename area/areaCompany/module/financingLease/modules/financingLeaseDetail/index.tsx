import { useEffect, useRef } from 'react';

import dayjs from 'dayjs';

import Next from '@pages/area/areaF9/components/next';
import { useParams } from '@pages/area/areaF9/hooks';
import { isCity, isCounty, isProvince } from '@pages/area/areaF9/utils';

import { EXPORT } from '@/components/exportDoc';
import FilterTableTemplate from '@/layouts/filterTableTemplate';
import ModuleWrapper from '@/layouts/filterTableTemplate/moduleWrapper';
import { useImmer } from '@/utils/hooks';

import useColumns from './useColumns';
import useScreen from './useScreen';
import useTableData from './useTableData';

const DEFAULT_CONDITION = {
  // 固定传参
  informationSource: '1',
  // 仅模糊搜索承租人
  keyWordType: '1',
  skip: '0',
  pageSize: 50,
  sortKey: 'startDate',
  sortType: 'desc',
  isLatest: '1',
  keyWord: '',
  // 承租人分类
  companyTypeCodeLessee: '',
  endDateFrom: '',
  endDateTo: '',
};

const FinancingLeaseDetail = () => {
  const domRef = useRef<any>(null);
  const [condition, setCondition] = useImmer<any>({});
  // 获取地区代码
  const { regionCode } = useParams();
  const { screenConfig, handleMenuChange } = useScreen(setCondition);
  const stickyDom = domRef.current?.getDiv();
  const { loading, tableData, current, total, handleTableChange, onPageChange, loadType, error } = useTableData({
    condition,
    setCondition,
    stickyDom,
  });
  const columns = useColumns({ current, restParams: { keyWord: condition?.keyWord } });
  useEffect(
    function initCondition() {
      if (regionCode) {
        let areaRegionCodeLessee = '',
          areaCityCodeLessee = '',
          areaCountyCodeLessee = '';
        if (isProvince(regionCode)) {
          areaRegionCodeLessee = regionCode;
        }
        if (isCity(regionCode)) {
          areaCityCodeLessee = regionCode;
        }
        if (isCounty(regionCode)) {
          areaCountyCodeLessee = regionCode;
        }
        setCondition(() =>
          Object.assign({ ...DEFAULT_CONDITION, areaRegionCodeLessee, areaCityCodeLessee, areaCountyCodeLessee }),
        );
      }
    },
    [regionCode, setCondition],
  );
  const onClear = () => {
    setCondition((d) => {
      d.keyWord = '';
    });
  };
  const handleSearch = (v: string) => {
    setCondition((d) => {
      d.keyWord = v;
    });
  };

  return (
    <ModuleWrapper ref={domRef} title="租赁融资明细">
      <FilterTableTemplate
        condition={condition}
        setCondition={setCondition}
        defaultCondition={DEFAULT_CONDITION}
        exportConfig={{
          condition: {
            ...condition,
            exportFlag: true,
          },
          usePost: true,
          filename: '租赁融资明细' + dayjs().format('YYYYMMDD'),
          type: EXPORT,
          module_type: 'regionalFinancingF9_financeLeaseSpecialList',
        }}
        filterConfig={{
          screenConfig,
          handleMenuChange,
        }}
        error={error}
        tableConfig={{
          tableData,
          handleTableChange,
          current,
          total,
          loading,
          onPageChange,
          loadType,
          columns,
          stickyDom,
        }}
        searchConfig={{ dataKey: 'areaFinanceLeaseDetail', onClear, handleSearch }}
        headerFixConfig={{ screenTop: 0, tableTop: 40 }}
      />
      {!loading ? <Next /> : null}
    </ModuleWrapper>
  );
};

export default FinancingLeaseDetail;
