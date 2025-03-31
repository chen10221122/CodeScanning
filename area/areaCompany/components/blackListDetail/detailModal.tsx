import { FC, useRef, useState, useEffect, useMemo } from 'react';

import styled from 'styled-components';

// import { Empty, Modal, Row } from '@/components/antd';
import { Modal, Spin } from '@/components/antd';
import { getListDetail } from '@/pages/detail/modules/enterprise/overview/modules/qualityList/api';
import { LinkToFile, StockPopver } from '@/pages/detail/modules/enterprise/overview/modules/qualityList/components';
import ModuleTable from '@/pages/detail/modules/enterprise/overview/modules/qualityList/components/detailTable';
import {
  ETagType,
  ModalPageSize as pageSize,
} from '@/pages/detail/modules/enterprise/overview/modules/qualityList/constant';
import { isExpired } from '@/pages/detail/modules/enterprise/overview/modules/qualityList/utils';
import { useTableScrollSticky } from '@/utils/hooks';

import { FilterCondition, FilterSummary } from './detailFilter';
import S from './style.module.less';
import useColumn from './useDetailColumn';
import useList from './useList';

interface IDetailProps {
  params: any;
  tagType: string;
  visible: boolean;
  setVisible: (val: boolean) => void;
}

type HeadInfo = {
  publicationDate?: string;
  fileList?: string;
  dataSource?: string;
};

interface ITitleProps {
  title: string;
  headInfo: HeadInfo;
  tagType: string;
  beginDate?: string;
  endDate?: string;
  appraiseOrg?: string;
}

const originCondition = {
  code: '',
  type: '',
  // 成立日期筛选
  establishDate: '',
  // 是否导出
  exportFlag: '',
  // 是否查询主体公司并置顶
  isQueryMainCompany: 1,
  // 是否查询数据来源
  isQueryUniqueFields: 1,
  keyWord: '',
  pageSize,
  // 注册资本筛选
  registerCapital: '',
  // 登记状态筛选
  registerStatus: '',
  skip: 0,
  sortKey: '',
  sortRule: '',
  tagCode: '',
};

const ModalTitle: FC<ITitleProps> = ({ title, headInfo, appraiseOrg, tagType, beginDate, endDate }) => {
  const [appraiseOrgArr, setAppraiseOrgArr] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);

  // 详情弹窗是否展示已到期
  const expired = useMemo(() => {
    const showTypeArr: string[] = [ETagType.SATI, ETagType.BLACKLIST];
    return !!(endDate && isExpired(endDate) && showTypeArr.includes(tagType));
  }, [endDate, tagType]);

  // 有效期
  const validity = useMemo(() => {
    const condition = tagType === ETagType.SATI && (beginDate || endDate);
    return condition ? (
      <span className="header-span">
        <span>
          有效期：
          <span>
            {beginDate || '-'}至{endDate || '-'}
          </span>
        </span>
      </span>
    ) : null;
  }, [tagType, beginDate, endDate]);

  useEffect(() => {
    if (appraiseOrg?.includes('、')) {
      setAppraiseOrgArr(appraiseOrg.split('、'));
    }
  }, [appraiseOrg]);

  useEffect(() => {
    if (headInfo.dataSource?.includes('、')) {
      setDataSource(headInfo.dataSource.split('、'));
    }
  }, [headInfo.dataSource]);

  return (
    <div>
      <Title>
        <span>{`${title}_榜单明细`}</span>
        {expired && <ExpiredTag>已到期</ExpiredTag>}
      </Title>
      <HeaderInfo>
        <span className="header-span">
          <span className="app-content">
            认定单位：<span title={appraiseOrg}>{appraiseOrg || '-'}</span>
          </span>
          {appraiseOrgArr.length ? (
            <StockPopver data={appraiseOrgArr} targetSelector={'qualityList_module'}></StockPopver>
          ) : null}
        </span>
        {headInfo.dataSource && tagType !== ETagType.SATI ? (
          <span className="header-span">
            <span className="data-content">
              数据来源：<span title={headInfo.dataSource}>{headInfo.dataSource}</span>
            </span>
            {dataSource.length ? (
              <StockPopver data={dataSource} targetSelector={'qualityList_module'}></StockPopver>
            ) : null}
          </span>
        ) : null}
        {headInfo.publicationDate ? (
          <span className="header-span">
            公布日期：<span>{headInfo.publicationDate}</span>
          </span>
        ) : null}
        {validity}
        {headInfo.fileList ? (
          <span className="header-span">
            <span>原文：</span>
            <span className="link-file">
              <LinkToFile originalText={headInfo.fileList} />
            </span>
          </span>
        ) : null}
      </HeaderInfo>
    </div>
  );
};

const DetailModal = ({ params, tagType, visible, setVisible }: IDetailProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const keywordRef = useRef('');

  const { code, type, tagCode, tagName } = useMemo(
    () => ({
      code: params?.itCode || '',
      type: 'company',
      tagCode: params?.tagCode || '',
      tagName: params?.tagName || '',
    }),
    [params?.itCode, params?.tagCode, params?.tagName],
  );

  const originobj = useMemo(
    () => ({
      ...originCondition,
      code,
      type,
      tagCode,
    }),
    [code, type, tagCode],
  );

  const {
    hideRank,
    headInfo,
    groupItem,
    tableData,
    condition,
    pager,
    loading,
    firstLoaded,
    renderScreen,
    onFilterChange,
    // handleMenuChange,
    handleChangePage,
    handleSearch,
    handleSort,
    handleReset,
  } = useList({ originCondition: originobj, tagType, params, scrollRef, filterRef, getListData: getListDetail });

  const { columns, moduleType } = useColumn({
    tagType,
    pager,
    keyWord: `${condition.keyWord}`,
  });
  /* 计算是否有sticky滚动条 */
  const hasStickyScroll = useTableScrollSticky({
    parentDom: document.getElementById('detail-modal-wrapper') as any,
    currentDom: tableRef,
    middleHeight: 159,
  });

  const finalColumn = useMemo(() => {
    const { publicationDate, dataSource, fileList } = groupItem;
    return columns
      .filter((column) => (publicationDate ? column.dataIndex !== 'publicationDate' : true))
      .filter((column) => (dataSource ? column.dataIndex !== 'dataSource' : true))
      .filter((column) => (fileList ? column.dataIndex !== 'fileList' : true))
      .filter((column) => (hideRank ? column.dataIndex !== 'rank' : true));
  }, [columns, groupItem, hideRank]);

  // 动态设置table的scroll
  const tableScroll = useMemo(
    () =>
      finalColumn.reduce(
        (prev, curr) => {
          return { x: prev.x + Number(curr.width) };
        },
        {
          x: 0,
        },
      ),
    [finalColumn],
  );

  return (
    <Modal
      title={null}
      type="helpUpdateRemindModal"
      modalWidth={1000}
      footer={null}
      visible={visible}
      destroyOnClose={true}
      onCancel={() => {
        setVisible(false);
      }}
      getContainer={() => document.getElementById('area-company-index-container') || document.body}
      wrapClassName={S.modalWrapper}
      id={'quality-list-detail-modal'}
      forceRender
    >
      {firstLoaded ? (
        <Spin type="fullThunder" />
      ) : (
        <ModalWrapper id="detail-modal-wrapper">
          <div>
            <ModalTitle
              headInfo={headInfo}
              appraiseOrg={(tableData?.[0] as any)?.appraiseOrg}
              title={tagName}
              tagType={tagType}
              beginDate={params?.startDate}
              endDate={params?.endDate}
            />
            <div ref={scrollRef}></div>
            <FilterWrapper ref={filterRef}>
              {renderScreen ? (
                <FilterCondition type={tagType} onChange={onFilterChange} onSearch={handleSearch} cref={keywordRef} />
              ) : null}
              <FilterSummary
                exportName={params?.tagName}
                module_type={moduleType}
                sum={pager.total}
                code={code}
                tagCode={params?.tagCode}
                condition={condition}
              />
            </FilterWrapper>
            <TableWrapper hasStickyScroll={hasStickyScroll} ref={tableRef}>
              <div>
                <ModuleTable
                  columns={finalColumn}
                  tableData={tableData}
                  loading={loading}
                  onChangePage={handleChangePage}
                  handleSort={handleSort}
                  handleReset={handleReset}
                  pager={pager}
                  pageSize={pageSize}
                  scroll={tableScroll}
                ></ModuleTable>
              </div>
            </TableWrapper>
          </div>
        </ModalWrapper>
      )}
    </Modal>
  );
};

export default DetailModal;

const Title = styled.div`
  display: flex;
  background: #fff;
  color: #141414;
  font-size: 18px;
  font-weight: 500;
  padding: 24px 0px 10px;
  text-align: left;
  align-items: center;
`;

const HeaderInfo = styled.div`
  /* padding-left: 32px; */
  /* height: 18px; */
  display: flex;
  font-size: 12px;
  font-weight: 400;
  text-align: justify;
  color: #595959;
  line-height: 18px;
  .header-span {
    display: flex;
    margin-right: 16px;
    .app-content {
      max-width: 193px;
    }
    .data-content {
      max-width: 220px;
    }
    .link-file {
      svg {
        display: flex;
        width: 16px;
      }
    }
  }
  .app-content,
  .data-content {
    text-overflow: ellipsis;
    word-break: keep-all; /* 不换行 */
    white-space: nowrap; /* 不换行 */
    overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    & ~ .arrow {
      margin-left: 6px;
    }
  }
`;

const ModalWrapper = styled.div`
  position: relative;
  height: calc(100vh - 100px);
  overflow: hidden;
  margin-right: 4px;
  padding-right: 28px;

  @media screen and (max-width: 1279px) {
    height: calc(100vh - 106px);
  }
  &:hover {
    overflow-y: overlay;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    border: none;
  }
`;

export const FilterWrapper = styled.div<{ top?: number }>`
  box-sizing: content-box;
  padding: 11px 0 0;
  height: 36px;
  background-color: #fff;
  position: sticky;
  top: ${({ top }) => (top ? top : 0)}px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex: auto;
`;

const ExpiredTag = styled.span`
  display: inline-flex;
  justify-content: center;
  width: 52px;
  height: 18px;
  line-height: 18px;
  margin-left: 10px;
  background: #f6f6f6;
  border-radius: 9px;
  color: #8c8c8c;
  font-size: 12px;
  font-weight: 400;
`;

const TableWrapper = styled.div<{ hasStickyScroll: boolean }>`
  .quality-list-empty-content {
    min-height: 500px !important;
  }
  .ant-table-sticky-scroll {
    display: ${({ hasStickyScroll }) => (hasStickyScroll ? 'block' : 'none')};
  }
`;
