import { useMemo } from 'react';
import { useHistory } from 'react-router';

import { cloneDeep, isArray, isEmpty, isUndefined } from 'lodash';
import styled from 'styled-components';

import CommonLink from '@/app/components/CommonLink';
import { Icon } from '@/components';
import NameFold from '@/components/foldDropMenu';
import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import CusCompanyEllipsis from '@/pages/area/areaFinancingBoard/components/companyEllipsis';
import { REGIONAL_MODAL } from '@/pages/area/areaFinancingBoard/config';
import { StyleSource } from '@/pages/detail/modules/enterprise/corporateFinancing/common/style';
import PDF_image from '@/pages/finance/financingLeaseNew/images/PDF.svg';
import CompanyEllipsis from '@/pages/finance/financingLeaseNew/modules/censusAnalyse/components/companyEllipsis';
import { windowOpen } from '@/utils/download';
import { getExternalLink } from '@/utils/format';

const getCompanyList = (array?: { name?: string; code?: string }[]) => {
  const nameList: string[] = [];
  const codeList: string[] = [];
  if (isEmpty(array) || !isArray(array)) {
    return { nameList, codeList };
  }
  array.forEach((item: { name?: string; code?: string }) => {
    const { name, code } = item || {};
    nameList.push(name || '');
    codeList.push(code || '');
  });

  return {
    nameList,
    codeList,
  };
};

//债券融资，净融资额，新发行债券只数，债券偿还压力弹窗
const useAreaColumns = (curPage: number, type: REGIONAL_MODAL, columnsConf?: any) => {
  const history = useHistory();

  const indicatorColumns = useMemo(() => {
    if (!columnsConf) return [];
    let copyIndicators = cloneDeep(columnsConf);
    /** 将传入的配置信息生成对应的column */
    const getColumnItem = (item: any) => {
      const {
        title,
        sortKey,
        align,
        dataIndex,
        className,
        wrapLine,
        isTextEllipsis,
        LesseeOrLeaser,
        isCreditRating,
        detailModalResizable,
        isDetailModalFixed = false,
      } = item;
      const titleText = <span title={title}>{title}</span>;
      if (isUndefined(align)) item.align = 'center';
      /* 根据有无排序给title赋值*/
      item.title = titleText;
      /* 注意：dataIndex是用作表格列数据渲染的， sortKey是用来传递排序参数的，dataIndex和sortKey可能不是一样的，所以配置两个参数*/
      item.dataIndex = dataIndex ?? sortKey;
      item.key = item.dataIndex;
      item.resizable = isDetailModalFixed && detailModalResizable ? detailModalResizable : true;
      item.wrapLine = wrapLine;
      item.className = className;
      item.fixed = isDetailModalFixed ? 'left' : false;
      if (!item.render) {
        item.render = (text: any, record: any) => {
          let result: any;
          if (text) {
            result = <span title={text}>{text}</span>;
            if (isTextEllipsis) {
              result = (
                <CompanyEllipsis
                  // isNormalType
                  data={LesseeOrLeaser === 'lessee' ? record?.lessee : record?.leaser || []}
                  type={LesseeOrLeaser}
                  textLimitwidth={item.width - 25}
                  // noTag={name === LesseeOrLeaser}
                />
              );
            }
            if (isCreditRating) {
              result = (
                <div className="creditRating">
                  <span title={record?.creditRating}>{record?.creditRating}</span>
                  {record?.creditRatingAddress && (
                    <CommonLink to={getExternalLink(record?.creditRatingAddress, true)}>
                      <img src={PDF_image} alt="" style={{ width: '14px', marginLeft: '4px' }} />
                    </CommonLink>
                  )}
                </div>
              );
            }
          } else result = '-';
          return result;
        };
      }
      return item;
    };

    /** 循环 indicators 生成对应的columns结构 */
    const getColumns = (indicatorData: any[]) => {
      const newTree = indicatorData?.map((item) => getColumnItem(item));
      return newTree;
    };

    const indicatorColumns = getColumns(copyIndicators) || [];
    return indicatorColumns;
  }, [columnsConf]);

  const columnMap = useMemo(() => {
    return new Map([
      [
        REGIONAL_MODAL.TRUST_FINANCING,
        [
          {
            title: '序号',
            key: 'idx',
            dataIndex: 'idx',
            // width: 42 + Math.max((String(curPage * PAGESIZE).length - 2) * 13, 0),
            width: Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42),
            fixed: 'left',
            align: 'center',
            render: (_: any, __: any, idx: number) => (curPage - 1) * PAGESIZE + idx + 1,
          },
          {
            title: '融资方',
            key: 'financeCompany',
            dataIndex: 'financeCompany',
            width: 238,
            fixed: 'left',
            align: 'left',
            wrapLine: true,
            resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
            render: (text: any, row: Record<string, any>) => {
              if (isEmpty(text)) return <>-</>;
              const { nameList, codeList } = getCompanyList(text);
              return <NameFold clampNumber={2} nameList={nameList} codeList={codeList} />;
            },
          },
          {
            title: '信托公司',
            key: 'trustCompany',
            dataIndex: 'trustCompany',
            sorter: true,
            width: 238,
            align: 'left',
            resizable: true,
            wrapLine: true,
            render: (text: any, row: Record<string, any>) => {
              if (isEmpty(text)) return <>-</>;
              const { nameList, codeList } = getCompanyList(text);
              return <NameFold clampNumber={2} nameList={nameList} codeList={codeList} />;
            },
          },
          {
            title: '起始日期',
            key: 'startDate',
            dataIndex: 'startDate',
            sorter: true,
            defaultSortOrder: 'descend',
            width: 100,
            resizable: true,
            align: 'center',
            render: (text: string) => text || '-',
          },
          {
            title: '担保人',
            key: 'guaranteeCompany',
            dataIndex: 'guaranteeCompany',
            sorter: true,
            width: 238,
            align: 'left',
            resizable: true,
            wrapLine: true,
            render: (text: any, row: Record<string, any>) => {
              if (isEmpty(text)) return <>-</>;
              const { nameList, codeList } = getCompanyList(text);
              return <NameFold clampNumber={2} nameList={nameList} codeList={codeList} />;
            },
          },
          {
            title: '融资金额',
            key: 'financeAmount',
            dataIndex: 'financeAmount',
            width: 100,
            sorter: true,
            align: 'right',
            resizable: true,
            render: (text: string) => text || '-',
          },
          {
            title: '利率',
            key: 'annualRate',
            dataIndex: 'annualRate',
            sorter: true,
            width: 70,
            align: 'right',
            resizable: true,
            render: (text: string) => text || '-',
          },
          {
            title: '期限',
            key: 'period',
            dataIndex: 'period',
            width: 68,
            align: 'center',
            resizable: true,
            render: (text: string) => text || '-',
          },
          {
            title: '披露日期',
            key: 'disclosureDate',
            dataIndex: 'disclosureDate',
            sorter: true,
            width: 100,
            align: 'center',
            resizable: true,
            render: (text: string) => text || '-',
          },
          {
            title: '截止日期',
            key: 'endDate',
            dataIndex: 'endDate',
            sorter: true,
            width: 100,
            align: 'center',
            resizable: true,
            render: (text: string) => text || '-',
          },
          {
            title: '信托计划',
            key: 'trustPlanName',
            dataIndex: 'trustPlanName',
            width: 238,
            align: 'left',
            resizable: true,
            wrapLine: true,
            render: (text: string) => <TextWrap line={1}>{text || '-'}</TextWrap>,
          },
          {
            title: '信息来源',
            key: 'fileName',
            dataIndex: 'fileName',
            sorter: true,
            width: 118,
            align: 'center',
            resizable: true,
            render: (text: any, obj: any) => {
              return (
                <StyleSource>
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (obj.fileUrl) {
                        const ret = getExternalLink(obj.fileUrl);
                        if (typeof ret === 'string') {
                          windowOpen(obj.fileUrl);
                        } else {
                          history.push(ret);
                        }
                      }
                    }}
                  >
                    {text}
                    {obj.fileUrl ? <Icon style={{ width: 14, height: 14 }} symbol="iconicon_pdf_normal2x" /> : null}
                  </div>
                </StyleSource>
              );
            },
          },
        ],
      ],
      [
        REGIONAL_MODAL.RECEIVE_FINANCING,
        [
          {
            title: '序号',
            key: 'idx',
            dataIndex: 'idx',
            // width: 42 + Math.max((String(curPage * PAGESIZE).length - 2) * 13, 0),
            width: Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42),
            fixed: 'left',
            align: 'center',
            render: (_: any, __: any, idx: number) => (curPage - 1) * PAGESIZE + idx + 1,
          },
          {
            title: '登记起始日',
            key: 'registerStartDate',
            dataIndex: 'registerStartDate',
            width: 107,
            fixed: 'left',
            align: 'center',
            sorter: true,
            defaultSortOrder: 'descend',
            resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
            render: (text: string) => text || '-',
          },
          {
            title: '融资企业',
            key: 'financeCompany',
            dataIndex: 'financeCompany',
            width: 238,
            sorter: true,
            align: 'left',
            wrapLine: true,
            resizable: true,
            render: (text: any, row: Record<string, any>) => {
              if (!text && !isEmpty(text)) return '-';
              return <CusCompanyEllipsis data={row?.financeCompany} textLimitwidth={213} />;
            },
          },
          {
            title: '质权人/受让人',
            key: 'pledgeeOrAssignee',
            dataIndex: 'pledgeeOrAssignee',
            width: 238,
            align: 'left',
            sorter: true,
            wrapLine: true,
            resizable: true,
            render: (text: any, row: Record<string, any>) => {
              if (!text && !isEmpty(text)) return '-';
              return <CusCompanyEllipsis data={row?.pledgeeOrAssignee} textLimitwidth={213} />;
            },
          },
          {
            title: '融资类型',
            key: 'financeType',
            dataIndex: 'financeType',
            sorter: true,
            width: 110,
            resizable: true,
            render: (text: string) => text || '-',
          },
          {
            title: '融资额(万元)',
            key: 'financeAmount',
            dataIndex: 'financeAmount',
            width: 118,
            align: 'right',
            sorter: true,
            resizable: true,
            render: (text: string) => text || '-',
          },
          {
            title: '期限',
            key: 'period',
            dataIndex: 'period',
            width: 75,
            align: 'right',
            sorter: true,
            resizable: true,
            render: (text: string) => text || '-',
          },
          {
            title: '登记到期日',
            key: 'registerEndDate',
            dataIndex: 'registerEndDate',
            width: 107,
            align: 'center',
            sorter: true,
            resizable: true,
            render: (text: string) => text || '-',
          },
          {
            title: '质押/转让财产价值(万元)',
            key: 'pledgeeOrAssigneeWorth',
            dataIndex: 'pledgeeOrAssigneeWorth',
            width: 189,
            align: 'right',
            sorter: true,
            resizable: true,
            render: (text: string) => text || '-',
          },
          {
            title: '质押/转让财产描述',
            key: 'pledgeeOrAssigneeDescription',
            dataIndex: 'pledgeeOrAssigneeDescription',
            width: 238,
            align: 'left',
            wrapLine: true,
            resizable: true,
            render: (text: string) => {
              return (
                <EllipseWrap row={4} title={text}>
                  {text ?? '-'}
                </EllipseWrap>
              );
            },
          },
          {
            title: '行业',
            key: 'industry',
            dataIndex: 'industry',
            sorter: true,
            width: 140,
            align: 'left',
            wrapLine: true,
            resizable: true,
            render: (text: any) => (
              <EllipseWrap row={4} title={text?.join(',')}>
                {text?.join(',') || '-'}
              </EllipseWrap>
            ),
          },
          {
            title: '地区',
            key: 'area',
            dataIndex: 'area',
            width: 140,
            align: 'left',
            wrapLine: true,
            resizable: true,
            render: (text: string) => (
              <EllipseWrap row={4} title={text}>
                {text || '-'}
              </EllipseWrap>
            ),
          },
        ],
      ],
      [
        REGIONAL_MODAL.LEASE_FINANCING,
        [
          {
            title: '序号',
            key: 'idx',
            dataIndex: 'idx',
            width: 42 + Math.max((String(curPage * PAGESIZE).length - 2) * 13, 0),
            fixed: 'left',
            align: 'center',
            render: (_: any, __: any, idx: number) => (curPage - 1) * PAGESIZE + idx + 1,
          },
          ...indicatorColumns,
        ],
      ],
    ]);
  }, [curPage, history, indicatorColumns]);

  const columns = useMemo(() => {
    return columnMap.get(type) || [];
  }, [type, columnMap]);

  const scrollX = useMemo(() => {
    return columns.reduce((acc, cur) => acc + (cur?.width || 0), 0) + columns.length - 1;
  }, [columns]);

  return { scrollX, columns };
};

export default useAreaColumns;

export const EllipseWrap = styled.div<{ row?: number }>`
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  display: -webkit-box;
  -webkit-line-clamp: ${(props) => (props.row ? props.row : 1)};
  -webkit-box-orient: vertical;
  white-space: unset !important;
`;
