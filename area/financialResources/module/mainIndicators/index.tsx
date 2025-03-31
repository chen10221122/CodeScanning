import { memo, useMemo, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { AREA_F9_AREA_MAININDICATORS } from '@/configs/localstorage';

import { Filter, Table } from '../../components';
import { Container } from '../common/container';
import { ContentContainer } from '../common/contentContainer';
import styles from '../common/style.module.less';
import WrapperContainer from '../common/wrapperContainer';
import useAddToDataView from './useAddToDataView';
import useColumns from './useColumns';
import useLogic from './useLogic';

const Content = () => {
  const domRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [hiddenChecked, setHiddenChecked] = useState({
    hiddenBlankRow: true,
    hiddenRanking: false,
  });

  const {
    renderScreen,
    loading,
    menuOption,
    handleMenuChange,
    listCondition,
    listData,
    pager,
    handleSearch,
    onPageChange,
    handleSort,
    handleReset,
    regionName,
  } = useLogic(hiddenChecked, scrollRef);

  const [dataIndex, setDataIndex] = useState<any[]>([]);
  const column = useColumns({
    pager,
    hiddenRanking: hiddenChecked.hiddenRanking,
    keyWord: listCondition.text,
    dataIndex,
  });

  const [finalColumn, setFinalColumn] = useState<any[]>([]);

  const indicNames = useMemo(() => {
    const indicNamesArr = finalColumn.reduce(
      (prev, curr) => (curr.indicName ? [...prev, curr.indicName] : [...prev]),
      [],
    );
    return indicNamesArr?.join(',');
  }, [finalColumn]);

  const { handleAddToEnterpriseDataView } = useAddToDataView({
    tableParamsData: { ...listCondition, pageSize: 1000, skip: 0 },
  });

  // 隐藏空行和隐藏排名处理
  const handleChangeHidden = useMemoizedFn((key: 'hiddenBlankRow' | 'hiddenRanking') => {
    setDataIndex(finalColumn.map((item) => item.dataIndex || item.indicName));
    setHiddenChecked((d) => ({
      ...d,
      [key]: !d[key],
    }));
  });

  return (
    <ContentContainerWrapper ref={domRef} className={styles.container}>
      <Container>
        <Filter
          menuOption={menuOption}
          handleMenuChange={handleMenuChange}
          condition={listCondition}
          total={pager.total}
          isHiddenRank={true}
          dataView={{
            platform: 'finance',
            handleAddToEnterpriseDataView,
          }}
          exportConfig={{
            module_type: 'regionalFinancialResource_localbank_indic',
            exportOtherCondition: { exportFlag: true, pageSize: '', indicNames },
            regionName: regionName || '-',
            title: '属地银行主要财务指标',
          }}
          hiddenChecked={hiddenChecked}
          onChangeHidden={handleChangeHidden}
          handleSearch={handleSearch}
          dataKey={AREA_F9_AREA_MAININDICATORS}
          placeholder="请输入银行名称"
          bordered={true}
          screenInfo="报告期"
          renderScreen={renderScreen}
          lastBorder={true}
        />
        <div id="area-mainIndicators">
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-44px' }} ref={scrollRef}></div>
            <Table
              columns={column}
              tableData={listData}
              loading={loading}
              onChangePage={onPageChange}
              handleSort={handleSort}
              handleReset={handleReset}
              targetSelector={'#area-mainIndicators'}
              hasSettingColumn
              pager={pager}
              headFixedPosition={44}
              setFinalColumn={setFinalColumn}
              tabHeight={63}
            />
          </div>
        </div>
      </Container>
    </ContentContainerWrapper>
  );
};

const Index = () => {
  return <WrapperContainer content={<Content />}></WrapperContainer>;
};

export default memo(Index);

const ContentContainerWrapper = styled(ContentContainer)`
  .seleft-left {
    .screen-wrapper {
      > div + div {
        margin-right: 16px;
      }
      > div:first-child {
        margin-right: 6px;
      }
      > div:last-child {
        border: none;
        margin-right: 5px;
      }
      > div:nth-child(-n + 2) {
        line-height: 14px;
        font-size: 12px;
      }
    }
    .search {
      margin-left: 0;
    }
  }
  .ant-table-thead {
    > tr:first-child .ant-table-cell-father {
      font-weight: 500 !important;
      border-bottom: none;
    }
  }
`;
