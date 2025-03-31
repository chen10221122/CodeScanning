import { FC, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Table as DzhTable } from '@dzh/components';
// useRequest, useDebounceFn,
import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

// import { useDispatch } from '@pages/area/areaF9/context';

// import { getGuid } from '@dataView/api';

import { Spin } from '@/components/antd';
// LINK_INFORMATION_TRACE
import { LINK_AREA_ECONOMY } from '@/configs/routerMap';
import { tipsMap } from '@/pages/area/areaF9/components/header-content/Tag/config';
// import TipsPopover from '@/pages/area/areaF9/components/header-content/tipsPopover';
import { useCityData } from '@/pages/area/areaF9/components/header-content/typeTag/useCityData';
import { useAreaJumpLimit } from '@/pages/area/areaF9/hooks';
import { formatNumber } from '@/utils/format';
import { dynamicLink } from '@/utils/router';
// urlQueriesSerialize
import { urlJoin } from '@/utils/url';

interface Props {
  data?: any;
  code?: string;
  isCity?: boolean;
  title: string;
  traceSource?: boolean;
  handleClose?: () => void;
}

const ListTable: FC<Props> = ({ data, code, title, isCity }) => {
  const history = useHistory();

  // const dispatch = useDispatch();

  const { data: resData, run, loading } = useCityData();
  const { handleLimit } = useAreaJumpLimit();

  /** 获取跳转接口的 guid */
  // const { run: runGetGuid } = useRequest(getGuid, {
  //   manual: true,
  //   onSuccess: ({ data }) => {
  //     if (data) {
  //       history.push(
  //         urlJoin(
  //           LINK_INFORMATION_TRACE,
  //           urlQueriesSerialize({
  //             guId: data,
  //           }),
  //         ),
  //       );
  //     }
  //   },
  // });

  /** 城市群、都市圈溯源跳转 */
  // const { run: handleGDPTrance } = useDebounceFn(
  //   (regionCode: string, year: string) => {
  //     const reqParams = {
  //       businessCodeInfo: [regionCode, '3'],
  //       indexParam: {
  //         indexId: 'REGION_10000017#s5Sj6UXALn',
  //         paramMap: {
  //           auditYear: [year],
  //           reportDateType: ['0'],
  //         },
  //       },
  //     };
  //     // 请求并跳转
  //     runGetGuid(reqParams);
  //     handleClose();
  //   },
  //   { leading: true, trailing: false, wait: 1000 },
  // );

  /**  地区跳转 */
  const handleAreaJump = useMemoizedFn((areaCode) => {
    areaCode &&
      handleLimit(areaCode, () => {
        history.push(urlJoin(dynamicLink(LINK_AREA_ECONOMY, { key: 'regionEconomy', code: areaCode })));
      });
  });

  useEffect(() => {
    if (code) {
      run({ code, type: 'plateArea', gdpFlag: 1 });
    }
  }, [code, run]);

  const citycolums = useMemo(
    () => [
      {
        // title: () => (
        //   <div className="text-popover">
        //     <div>城区常住人口(万人)</div>
        //     <TipsPopover content={<div>优先取地区最新年度常住人口规模，如无取户籍人口</div>} />
        //   </div>
        // ),
        title: '城区常住人口(万人)',
        dataIndex: 'mValue',
        align: 'right',
        width: 164,
        render: (text: any, row: any) => {
          return text ? (
            // traceSource ? (
            //   <TranceStyle
            //     onClick={() => {
            //       dispatch((d) => {
            //         d.tranceModalInfo = {
            //           info: {
            //             regionCode: row?.regionCode4 || '',
            //             cityPop: title,
            //             title: `${row?.regionName}_城区常住人口(万人)`,
            //             totalValue: row?.mValue || '',
            //             year: row?.endDate || '',
            //           },
            //           visible: true,
            //         };
            //       });
            //       handleClose();
            //     }}
            //   >
            //     {text ? formatNumber(text) : '-'}
            //   </TranceStyle>
            // ) :
            <span className="text"> {text ? formatNumber(text) : '-'}</span>
          ) : (
            '-'
          );
        },
      },
    ],
    [],
  );

  const countryColumns = useMemo(
    () => [
      {
        title: 'GDP(亿元)',
        dataIndex: 'gdpValue',
        align: 'right',
        width: 164,
        render: (text: any, row: any) => {
          return text ? (
            //  traceSource ? (
            //   <TranceStyle onClick={() => handleGDPTrance(row?.value, row?.latestYear)}>
            //     {text ? formatNumber(text) : '-'}
            //   </TranceStyle>
            // )
            // :
            <span className="text"> {text ? formatNumber(text) : '-'}</span>
          ) : (
            '-'
          );
        },
      },
    ],
    [],
  );

  const dataSource = useMemo(() => {
    return code ? resData : data;
  }, [code, data, resData]);

  const columns = useMemo(() => {
    const otherColums = isCity ? citycolums : countryColumns;
    return [
      {
        title: '序号',
        align: 'center',
        className: 'num-col',
        width: Math.max(`${dataSource?.length}`.length * 12, 42),
        render: (text: any, row: any, index: any) => index + 1,
      },
      {
        title: '地区',
        dataIndex: isCity ? 'regionName' : 'name',
        align: 'left',
        width: 178,
        render: (text: any, row: any) => {
          const code = isCity ? row?.regionCode4 : row?.value;
          return text ? <LinkStyle onClick={() => handleAreaJump(code)}>{text}</LinkStyle> : '-';
        },
      },
      ...otherColums,
    ];
  }, [citycolums, countryColumns, dataSource?.length, handleAreaJump, isCity]);

  const scroll = useMemo(
    () =>
      columns.reduce(
        (pre: any, cur: any) => {
          if (cur.width) return { x: pre.x + Number(cur.width) };
          else return pre;
        },
        { x: 0 },
      ),
    [columns],
  );

  return (
    <Container loading={loading}>
      <Spin type="square" spinning={loading}>
        <div className="table-container" id="popover-table-id">
          <DzhTable
            dataSource={dataSource}
            columns={columns as any}
            sticky={{
              offsetHeader: 0,
              getContainer: () => document.getElementById('popover-table-id') as HTMLElement,
            }}
            scroll={scroll}
            rowKey={(k: any) => JSON.stringify(k)}
            pagination={false}
          />
        </div>
        {tipsMap?.get(title)?.tips ? <div className="bottom">{`*${tipsMap?.get(title)?.tips}`}</div> : null}
      </Spin>
    </Container>
  );
};

export default ListTable;
const Container = styled.div<{ loading: boolean }>`
  .dzh-table .ant-table .ant-table-thead > tr > th {
    padding-top: 6px;
    padding-bottom: 6px;
    line-height: 18px;

    &:first-of-type {
      padding-left: 8px;
      padding-right: 8px;
    }
    .text-popover {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .dzh-table .ant-table .ant-table-tbody > tr {
    .num-col {
      padding-left: 8px;
      padding-right: 8px;
    }
  }
  .table-container {
    margin-right: 3px;
    padding: 0 5px 0 14px;
    max-height: 212px;
    overflow-x: hidden;
    overflow-y: auto;
    overflow-y: overlay;
    scrollbar-gutter: stable;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      width: 6px;
      background: #d7d7d7;
      border-radius: 4px;
    }
  }
  .bottom {
    margin-top: 9px;
    font-size: 12px;
    color: #8c8c8c;
    line-height: 18px;
    padding: 0 14px;
  }
  .ant-spin-container {
    height: ${({ loading }) => (loading ? '275px' : '100%')};
  }
`;
// const TranceStyle = styled.div`
//   color: #025cdc;
//   cursor: pointer;
//   text-decoration: underline;
// `;
const LinkStyle = styled.div`
  color: #025cdc;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
