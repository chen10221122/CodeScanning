import KeepAlive from 'react-activation';

import { isEmpty } from 'lodash';

import { getLeaseFinance } from '@/apis/area/areaFinancingBoard';
import { Spin } from '@/components/antd';
import { LINK_AREA_FINANCING_BY_SCALE } from '@/configs/routerMap';
import { useSelector } from '@/pages/area/areaF9/context';
import { Empty } from '@/pages/area/areaFinancingBoard/components';
import SeeMore from '@/pages/area/areaFinancingBoard/components/seeMore';
import Tab from '@/pages/area/areaFinancingBoard/components/Tab';
import useTab, { TabType } from '@/pages/area/areaFinancingBoard/components/Tab/useTab';
import useList from '@/pages/area/areaFinancingBoard/hooks/useList';
import { getCensusAnalyseDetailData } from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/api';
import DetailModal from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/components/detailModal';
import useChooseColumn from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/components/detailModal/useChooseColumn';
import { dynamicLink } from '@/utils/router';
import { urlJoin } from '@/utils/url';

import { Wrapper, Header, Center } from '../../components/moduleWrapper/styles';
import LineBar from './modules/graph';
import FinancingTable from './modules/table';
import useDetailData from './useDetailData';

const LeaseFinancing = () => {
  const { tabConfig, tab, onTabChange } = useTab(1);
  const { areaInfo } = useSelector((store) => ({ areaInfo: store.areaInfo }));

  const { loading, data } = useList({ listApiFunction: getLeaseFinance, type: 'leaseFinancing' });

  const {
    visible,
    count,
    title,
    dataSource,
    loading: detailLoading,
    condition,
    curPage,
    handlePageChange,
    handleOpenModal,
    closeModal,
  } = useDetailData({ detailListApiFunction: getCensusAnalyseDetailData });

  const { column } = useChooseColumn({ type: 'leaseEventNum' });

  return (
    <Wrapper ratio={33.3} gap={2} height={244} id="areaFinancingBoard-leaseFinancing">
      <Header>
        <div className="wrapper-title">租赁融资</div>
        {!isEmpty(data) ? (
          <Center>
            <Tab {...{ tabConfig, tab, onTabChange }} />
            <SeeMore
              link={urlJoin(dynamicLink(LINK_AREA_FINANCING_BY_SCALE, { code: areaInfo?.regionCode as string }))}
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
                <FinancingTable tableData={data} handleOpenModal={handleOpenModal} />
              </KeepAlive>
            ) : null}
          </>
        ) : (
          <Empty />
        )}
      </Spin>
      {visible ? (
        <DetailModal
          title={title}
          loading={detailLoading}
          visible={visible}
          total={count}
          exportFileName={`${title}`}
          exportCondition={{
            ...condition,
            module_type: 'financeLease_detail_leaseEventNum_total',
            from: '0',
            size: '1000',
          }}
          columnsConf={column}
          data={dataSource}
          currentPage={curPage}
          onPageChange={handlePageChange}
          setVisible={closeModal}
          container={document.querySelector('#areaFinancingBoard-leaseFinancing') as HTMLElement}
        />
      ) : null}
    </Wrapper>
  );
};

export default LeaseFinancing;
