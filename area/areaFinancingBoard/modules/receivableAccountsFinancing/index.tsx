import { useMemo } from 'react';
import KeepAlive from 'react-activation';

import dayJs from 'dayjs';
import { isEmpty } from 'lodash';

import { getReceivablesFinance, getCompanyScaleDetail } from '@/apis/area/areaFinancingBoard';
import { Spin } from '@/components/antd';
import { LINK_FINANCE_ACCOUNTS_RECEIVABLE_FINANCING } from '@/configs/routerMap';
import { useSelector } from '@/pages/area/areaF9/context';
import { Empty } from '@/pages/area/areaFinancingBoard/components';
import DetailModal from '@/pages/area/areaFinancingBoard/components/detailModal';
import SeeMore from '@/pages/area/areaFinancingBoard/components/seeMore';
import Tab from '@/pages/area/areaFinancingBoard/components/Tab';
import useTab, { TabType } from '@/pages/area/areaFinancingBoard/components/Tab/useTab';
import useDetailData from '@/pages/area/areaFinancingBoard/hooks/useDetailData';
import useList from '@/pages/area/areaFinancingBoard/hooks/useList';
import useDetailColumns from '@/pages/area/areaFinancingBoard/modules/financingScale/modules/enterprise/Table/hooks/useDetailColumns';
import { dynamicLink } from '@/utils/router';
import { urlJoin } from '@/utils/url';

import { Wrapper, Header, Center } from '../../components/moduleWrapper/styles';
import { REGIONAL_MODAL } from '../../config';
import LineBar from './modules/graph';
import FinancingTable from './modules/table';

const ReceivableAccountsFinancing = () => {
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));
  const { tabConfig, tab, onTabChange } = useTab(1);

  const { loading, data } = useList({ listApiFunction: getReceivablesFinance, type: 'receivableAccountsFinancing' });

  const {
    date,
    condition,
    visible,
    loading: detailLoading,
    count,
    curPage,
    dataSource,
    setVisible,
    handleOpenModal: openBondFinancingModal,
    handleTableChange,
    handlePageChange: handleDetailPageChange,
  } = useDetailData({
    detailListApiFunction: getCompanyScaleDetail,
  });

  const detailTitle = useMemo(() => {
    return `${areaInfo?.regionName}${date}新增应收账款融资事件明细`;
  }, [areaInfo?.regionName, date]);

  const { scrollX, columns: detailColumns } = useDetailColumns(curPage, REGIONAL_MODAL.RECEIVE_FINANCING);

  return (
    <Wrapper ratio={33.3} gap={2} height={244}>
      <Header>
        <div className="wrapper-title">应收账款融资</div>
        {!isEmpty(data) ? (
          <Center>
            <Tab {...{ tabConfig, tab, onTabChange }} />
            <SeeMore
              link={urlJoin(dynamicLink(LINK_FINANCE_ACCOUNTS_RECEIVABLE_FINANCING))}
              style={{ marginLeft: 16, lineHeight: '21px' }}
            />
          </Center>
        ) : null}
      </Header>
      <Spin type="square" spinning={loading}>
        {!isEmpty(data) ? (
          <>
            {tab === TabType.GRAPH ? (
              <KeepAlive id={tab} name={tab}>
                <LineBar data={data} />
              </KeepAlive>
            ) : null}
            {tab === TabType.TABLE ? (
              <KeepAlive id={tab} name={tab}>
                <FinancingTable tableData={data} handleOpenModal={openBondFinancingModal} />
              </KeepAlive>
            ) : null}
          </>
        ) : (
          <Empty />
        )}
      </Spin>
      <DetailModal
        visible={visible}
        setVisible={setVisible}
        count={count}
        title={detailTitle}
        tableConfig={{
          dataSource,
          columns: detailColumns,
          scroll: { x: scrollX },
          restConfig: {
            sortDirections: ['descend', 'ascend'],
          },
        }}
        exportConfig={{
          condition: {
            ...condition,
            module_type: 'web_region_finance_receive_detail',
          },
          filename: `${detailTitle}-${dayJs().format('YYYY.MM.DD')}`,
        }}
        loading={detailLoading}
        page={curPage}
        onPageChange={handleDetailPageChange}
        onTableChange={handleTableChange}
        detailModalPrefix="area-company-receivable"
      />
    </Wrapper>
  );
};

export default ReceivableAccountsFinancing;
