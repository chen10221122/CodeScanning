import dayjs from 'dayjs';

import BackTop from '@/components/backTop';
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
  const {
    screenRef,
    debounceScreenHeadHeight,
    option,
    loading,
    sortChangeLoading,
    picker,
    refresh,
    handleScreenChange,
    tableInfo,
    date,
    condition,
    firstLoading,
    handlePageChange,
    handleDateChange,
    handleTableSortChange,
    handleClear,
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
  const areaInfo = useSelector((store) => store.areaInfo);
  const columns = useColumns({ openModal, condition });

  const content = (
    <ContentWrap>
      <Table
        columns={columns}
        tableInfo={tableInfo}
        skip={condition.from}
        loading={loading}
        debounceScreenHeadHeight={debounceScreenHeadHeight}
        pageChange={handlePageChange}
        sortChange={handleTableSortChange}
        handleClear={handleClear}
        sortChangeLoading={sortChangeLoading}
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
      title="融资规模统计"
      content={content}
      sortLoading={sortChangeLoading || loading}
      contentStyle={{ paddingBottom: 0 }}
      titleSticky={-35}
      headerBottomContent={
        <Filter
          screenRef={screenRef}
          withoutSearch={true}
          options={option}
          picker={picker}
          screenChange={handleScreenChange}
          total={tableInfo.total}
          date={date}
          dateChange={handleDateChange}
          usePost={false}
          reFresh={refresh}
          condition={{
            ...condition,
            module_type: 'receivable_financing_stat',
            sheetNames: { 0: `${areaInfo?.regionName || ''}-应收账款融资-融资规模统计` },
          }}
          filename={`${areaInfo?.regionName || ''}地区-应收账款融资-融资规模统计-${dayjs().format('YYYY-MM-DD')}`}
        />
      }
      loading={firstLoading}
    />
  );
};

export default Content;
