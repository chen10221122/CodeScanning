import dayjs from 'dayjs';

import BackTop from '@/components/backTop';
import { AREA_F9_FINANCE_DETAILS } from '@/configs/localstorage';
import { useSelector } from '@/pages/area/areaF9/context';
import WrapperContainer from '@/pages/area/areaF9/modules/accountReceivable/common/wrapperContainer';

import Filter from '../common/filter';
import { ContentWrap } from '../common/style';
import Table from '../common/table';
import useColumns from './useColumns';
import useData from './useData';

import '@/assets/styles/less/popover.less';

const Content = () => {
  const areaInfo = useSelector((store) => store.areaInfo);
  const {
    screenRef,
    reFresh,
    date,
    keywordRef,
    option,
    loading,
    tableInfo,
    firstLoading,
    sortChangeLoading,
    condition,
    debounceScreenHeadHeight,
    handleScreenChange,
    handlePageChange,
    handleTableSortChange,
    handleDateChange,
    handleSearch,
    handleClear,
    handleCheck,
  } = useData();

  const columns = useColumns({ condition });
  const content = (
    <ContentWrap>
      <Table
        debounceScreenHeadHeight={debounceScreenHeadHeight}
        columns={columns}
        tableInfo={tableInfo}
        skip={condition.from}
        loading={loading}
        pageChange={handlePageChange}
        sortChange={handleTableSortChange}
        handleClear={handleClear}
        sortChangeLoading={sortChangeLoading}
      />
      <BackTop target={() => (document.querySelector('.main-container') as HTMLElement) || document.body} />
    </ContentWrap>
  );

  return (
    <WrapperContainer
      title="应收账款融资明细"
      loading={firstLoading}
      sortLoading={sortChangeLoading || loading}
      content={content}
      contentStyle={{ paddingBottom: 0 }}
      titleSticky={-32}
      headerBottomContent={
        <Filter
          screenRef={screenRef}
          handleCheck={handleCheck}
          reFresh={reFresh}
          date={date}
          options={option}
          screenChange={handleScreenChange}
          total={tableInfo.total}
          dateChange={handleDateChange}
          keywordRef={keywordRef}
          dataKey={AREA_F9_FINANCE_DETAILS}
          handleSearch={handleSearch}
          condition={{ ...condition, module_type: 'receivable_financing_area_detail' }}
          filename={`${areaInfo?.regionName || ''}地区-应收账款融资明细-${dayjs().format('YYYY-MM-DD')}`}
        />
      }
    />
  );
};

export default Content;
