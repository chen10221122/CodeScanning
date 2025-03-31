import { memo, useRef, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { ProTableNews } from '@dzh/pro-components';
import Screen from '@dzh/screen';
import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import dayjs from 'dayjs';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import ExportDoc from '@/components/exportDoc';
import TopicSearch from '@/components/topicSearch';
import { INFORMATION_GOVINTEL_WORK_REPORT, INFORMATION_GOVINTEL_FIVE_YEAR_PLAN } from '@/configs/localstorage';
import { LINK_INFORMATION_GOV_WORK_REPORT, LINK_GO_WILD } from '@/configs/routerMap';
import { useNewsDetail } from '@/globalComponent/newsDetail';
import { useSelector } from '@/pages/area/areaF9/context';
import { getExternalLink } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import Layout from '../layout';
import useList from './useList';
import useScreenOption from './useScreenOption';

interface ModuleProps {
  tabKey: string;
  getContainer: () => HTMLElement;
}

const PREFIX = 'area_gov';

const IntegerModule = ({ tabKey, getContainer }: ModuleProps) => {
  const { regionName } = useSelector((s) => ({
    regionName: s.areaInfo?.regionName,
  }));
  const history = useHistory();
  const screenRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isGovWork = useMemo(() => tabKey === LINK_INFORMATION_GOV_WORK_REPORT, [tabKey]);
  const { screenOptions } = useScreenOption({ isGovWork });

  const {
    msg,
    count,
    error,
    tableData,
    condition,
    pager,
    loading,
    areaValue,
    firstLoaded,
    renderScreen,
    handleReset,
    handlePageChange,
    handleAreaChange,
    handlePeriodChange,
    handleAreaItemClick,
    handleSearch,
    onClear,
    showSummary,
    showSummaryBtn,
    setShowSummary,
  } = useList({
    isGovWork,
    scrollRef,
  });

  const openModal = useNewsDetail('information_govIntel', tableData, condition);

  // 处理第三方官网跳转
  const goLink = useMemoizedFn((txt) => {
    const url = txt;

    let link = url && getExternalLink(url);
    if (typeof link === 'string') {
      link = urlJoin(dynamicLink(LINK_GO_WILD), urlQueriesSerialize({ url: encodeURIComponent(link) }));
    }
    link && history.push(link);
  });

  //获取关键字
  const getCleanTextAndKeywords = (str?: string) => {
    const cleanText = str
      ? str.replace(/<em>(.*?)<\/em>/g, (target) => {
          const cleanText = target.replace(/<\/?em>/g, '');
          return cleanText;
        })
      : '';
    return { cleanText };
  };

  const columns = useMemo(() => {
    const publishYear = isGovWork
      ? [
          {
            title: '报告年份',
            width: 76,
            className: 'one-row-ellipsis',
            dataIndex: 'yearsNum',
            key: 'yearsNum',
            fixed: 'left',
            resizable: true,
            render: (text: string) => <span title={text}>{text ?? '-'}</span>,
          },
        ]
      : [];
    return [
      {
        title: '序号',
        className: 'dzh-table-column-index',
        width: Math.max(42, String(`${pager.current * 50}`).length * 13),
        fixed: 'left',
        align: 'center',
        /** @ts-ignore */
        render: (_, __, i) => i + 1 + (pager.current - 1) * 50,
      },
      ...publishYear,
      {
        title: '发布日期',
        width: 91,
        className: 'one-row-ellipsis',
        dataIndex: 'date',
        key: 'date',
        fixed: 'left',
        resizable: true,
        render: (text: string) => <span title={text}>{text ?? '-'}</span>,
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        // width: 406,
        width: '53%',
        fixed: 'left',
        resizable: { max: 2000 },
        // className: 'one-row-ellipsis',
        /** @ts-ignore */
        render: (text, record, index) => {
          const { cleanText: cleanTitle } = getCleanTextAndKeywords(text);
          const { cleanText: cleanSummary } = getCleanTextAndKeywords(record?.summary);
          return (
            <>
              <TextOverflowStyle
                maxRows={1}
                title={cleanTitle}
                className="text-title link"
                onClick={() => {
                  openModal(record, index);
                }}
                dangerouslySetInnerHTML={{ __html: text }}
              />
              <TextOverflowStyle
                maxRows={2}
                className={cn('text-summary', { 'text-summary-hidden': !showSummary })}
                title={cleanSummary}
                dangerouslySetInnerHTML={{ __html: record?.summary }}
              />
            </>
          );
        },
      },
      {
        title: '地区',
        // width: 206,
        width: '27%',
        resizable: true,
        className: 'one-row-ellipsis',
        key: 'area',
        /** @ts-ignore */
        render: (_, record) => {
          return !isEmpty(record?.areaClassifyMore)
            ? record.areaClassifyMore.map((item: Record<'classifyName' | 'classifyCode', string>, index: number) => (
                <>
                  {index > 0 && '-'}
                  <span className="area-item" onClick={handleAreaItemClick(item.classifyCode)}>
                    {item.classifyName}
                  </span>
                </>
              ))
            : '-';
        },
      },
      {
        title: '溯源',
        dataIndex: 'newsLinkNoC',
        key: 'newsLinkNoC',
        width: 50,
        resizable: true,
        align: 'left',
        render: (text: string) => {
          if (!text) return '-';
          return (
            <span className={text ? 'clickable' : ''} onClick={() => goLink(text)}>
              查看
            </span>
          );
        },
      },
      {
        title: '来源',
        dataIndex: 'source',
        key: 'source',
        // width: 159,
        width: '20%',
        resizable: true,
        className: 'one-row-ellipsis',
        render: (text: string) => <span title={text}>{text ?? '-'}</span>,
      },
      // {
      //   title: '',
      //   dataIndex: 'blank',
      // },
    ];
  }, [goLink, handleAreaItemClick, isGovWork, pager, showSummary, openModal]);

  // console.log('%ccondition', 'color: red; font-size: 20px', condition);

  const pagination = useMemo(() => {
    return pager.total > 50
      ? {
          current: pager.current,
          total: pager.total,
          pageSize: 50,
        }
      : false;
  }, [pager]);

  // 解决双滚动条处理
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [tableData]);

  return (
    <Layout
      error={error}
      loading={loading}
      total={pager.total}
      scrollRef={scrollRef}
      screenRef={screenRef}
      firstLoaded={firstLoaded}
      hasData={!!tableData?.length}
      renderScreen={renderScreen}
      onCleanClick={handleReset}
      scrollViewHeight="calc(100vh - 150px)"
      msg={msg}
      count={count}
      showSummary={showSummary}
      showSummaryBtn={showSummaryBtn}
      setShowSummary={setShowSummary}
      top={32}
    >
      {{
        screen: (
          <ScreenWrap>
            <Screen
              options={[screenOptions[0]]}
              onChange={handlePeriodChange}
              getPopContainer={() => screenRef.current!}
              size="small"
            />
            {/** 地区是要支持受控的，所以区分成两个screen组件 */}
            {screenOptions[1] ? (
              <Screen
                values={areaValue}
                options={[screenOptions[1]]}
                onChange={handleAreaChange}
                getPopContainer={() => screenRef.current!}
                size="small"
              />
            ) : null}
          </ScreenWrap>
        ),
        search: (
          <TopicSearch
            placeholder="请输入关键字"
            onClear={onClear}
            onSearch={handleSearch}
            dataKey={`${PREFIX}_${isGovWork ? INFORMATION_GOVINTEL_WORK_REPORT : INFORMATION_GOVINTEL_FIVE_YEAR_PLAN}`}
            focusedWidth={230}
          />
        ),
        excel: (
          <ExportDoc
            filename={`${regionName}-${isGovWork ? '政府工作报告' : '五年规划'}-${dayjs().format('YYYYMMDD')}`}
            condition={{
              ...condition,
              pagesize: 1000,
              module_type: isGovWork ? 'governmentWorkReport' : 'fiveYearPlan',
            }}
          />
        ),
        table: (
          <TableWrap>
            <ProTableNews
              onlyBodyLoading
              tableLayout="fixed"
              loading={{ spinning: loading, translucent: true, type: 'square' }}
              /** @ts-ignore */
              columns={columns}
              // scroll={{ x: 1032 }}
              dataSource={tableData}
              pagination={pagination}
              onChange={handlePageChange}
              sticky={{
                offsetHeader: 62,
                getContainer,
              }}
            />
          </TableWrap>
        ),
      }}
    </Layout>
  );
};
export default memo(IntegerModule);

const ScreenWrap = styled.div`
  display: flex;
  > div:not(:last-of-type) {
    margin-right: 24px;
  }
`;

const TableWrap = styled.div`
  margin-bottom: 16px;
  .dzh-table .ant-table .ant-table-thead > tr > th:nth-of-type(1) {
    padding: 5px 8px;
  }
  .ant-table-tbody > tr > td.one-row-ellipsis {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 1;
  }
  .area-item,
  .link {
    cursor: pointer;
    &:hover {
      color: #025cdc;
    }
  }
  .clickable {
    cursor: pointer;
    color: #025cdc;
  }
  .ant-table-container {
    .text-red {
      font-size: 13px;
      color: #e80e01 !important;
      line-height: 20px;
    }
    .text-summary-red {
      font-size: 12px;
      color: #e80e01 !important;
      line-height: 18px;
    }
    .text-summary {
      font-size: 12px;
      color: #858992 !important;
      line-height: 18px;
      &.text-summary-hidden {
        display: none;
      }
    }
    .text-summary-red {
      font-size: 12px;
      color: #e80e01 !important;
      line-height: 18px;
    }
  }
`;
const TextOverflowStyle = styled.div<{ maxRows: number }>`
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: ${({ maxRows }) => maxRows};
  -webkit-box-orient: vertical;
  overflow: hidden;
  em {
    color: #fe3a2f !important;
    font-style: normal;
  }
  p {
    margin: 0;
  }
  b {
    font-weight: 400;
  }
`;
