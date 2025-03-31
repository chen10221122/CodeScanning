import dayjs from 'dayjs';

import BackTop from '@/components/backTop';
import { AREA_F9_PLEDGERTRANSFEROR } from '@/configs/localstorage';
import { useSelector } from '@/pages/area/areaF9/context';
import WrapperContainer from '@/pages/area/areaF9/modules/accountReceivable/common/wrapperContainer';

import DetailModal from '../common/detailModal';
import Filter from '../common/filter';
import { ContentWrap } from '../common/style';
import Table from '../common/table';
import useColumns from './useColumns';
import useData from './useData';
import useModal from './useModal';

import '@/assets/styles/less/popover.less';

const Content = () => {
  const areaInfo = useSelector((store) => store.areaInfo);
  const {
    screenRef,
    debounceScreenHeadHeight,
    reFresh,
    date,
    keywordRef,
    option,
    loading,
    tableInfo,
    firstLoading,
    sortChangeLoading,
    condition,
    handleScreenChange,
    handlePageChange,
    handleTableSortChange,
    handleDateChange,
    handleSearch,
    handleClear,
    handleCheck,
  } = useData();

  const {
    exportName,
    moduleType,
    skip,
    modalTableInfo,
    modalColumn,
    modalVisible,
    modalCondition,
    title,
    modalFirstLoading,
    modalTableLoading,
    openModal,
    handleModalPageChange,
    handleModalClose,
  } = useModal({ condition });

  const columns = useColumns({ openModal, condition });
  const content = (
    <ContentWrap>
      <Table
        columns={columns}
        tableInfo={tableInfo}
        skip={condition.from}
        loading={loading}
        sortChangeLoading={sortChangeLoading}
        debounceScreenHeadHeight={debounceScreenHeadHeight}
        pageChange={handlePageChange}
        sortChange={handleTableSortChange}
        handleClear={handleClear}
      />
      <BackTop target={() => (document.querySelector('.main-container') as HTMLElement) || document.body} />
      <DetailModal
        name={exportName}
        moduleType={moduleType}
        skip={skip}
        info={modalTableInfo}
        title={title}
        visible={modalVisible}
        setVisible={handleModalClose}
        condition={modalCondition}
        columns={modalColumn}
        firstLoading={modalFirstLoading}
        tableLoading={modalTableLoading}
        handlePageChange={handleModalPageChange}
      />
    </ContentWrap>
  );

  return (
    <WrapperContainer
      title="按出质人/出让人统计"
      loading={firstLoading}
      sortLoading={sortChangeLoading || loading}
      content={content}
      contentStyle={{ paddingBottom: 0 }}
      titleSticky={-35}
      headerBottomContent={
        <Filter
          screenRef={screenRef}
          usePost={true}
          handleCheck={handleCheck}
          reFresh={reFresh}
          date={date}
          options={option}
          screenChange={handleScreenChange}
          total={tableInfo.total}
          dateChange={handleDateChange}
          keywordRef={keywordRef}
          dataKey={AREA_F9_PLEDGERTRANSFEROR}
          handleSearch={handleSearch}
          condition={{ ...condition, module_type: 'receivable_financing_pledgor_stat' }}
          filename={`${areaInfo?.regionName || ''}地区-应收账款融资-按出质人/出让人-${dayjs().format('YYYY-MM-DD')}`}
        />
      }
    />
  );
};

export default Content;
