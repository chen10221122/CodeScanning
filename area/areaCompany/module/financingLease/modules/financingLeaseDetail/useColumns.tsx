import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isObject } from 'lodash';

import getIndustryRender from '@pages/area/areaCompany/components/tableCpns/industry';
import CompanyEllipsis from '@pages/area/areaCompany/module/financingLease/template/companyEllipsis';
import Ellipsis from '@pages/finance/financingLease/components/ellipsis';
import { foramtTableDate } from '@pages/finance/financingLease/utils';

import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import { handleTableDataFormat } from '@/utils/format';

interface Props {
  current: number;
  restParams: Record<string, any>;
}
//** 承租人标签 */
enum LesseeTag {
  '央企' = 1,
  '国企' = 2,
  '港股' = 4,
  '发债' = 5,
  '城投' = 6,
  '民企' = 8,
  '城投子公司' = 9,
  '高新技术企业' = 10,
  '科技型中小企业' = 11,
  '专精特新“小巨人”' = 12,
  '专精特新中小企业' = 13,
  '央企子公司' = 14,
  '主板' = 15,
  '创业板' = 16,
  '科创板' = 17,
  '北交所' = 18,
}

/** 出租人标签 */
enum LeaserTag {
  '国企' = 2,
  '港股' = 4,
  '发债' = 5,
  '民企' = 8,
  '主板' = 15,
  '创业板' = 16,
  '科创板' = 17,
  '北交所' = 18,
}
export default ({ current, restParams }: Props) => {
  const handTags = useMemoizedFn(
    (
      lesseeTag: string,
      historyOverdueTag: string,
      newestRate: string,
      registerStatus: string,
      isLessee = false,
    ): string[] => {
      const tags: string[] =
        (lesseeTag
          ?.split(',')
          ?.map((d: any) => {
            if (d) {
              return isLessee ? LesseeTag[d] : LeaserTag[d];
            }
            return null;
          })
          .filter((d) => !!d) as string[]) || [];
      return tags;
    },
  );
  return useMemo(
    () =>
      [
        {
          title: '序号',
          dataIndex: 'idx',
          width: 42 + Math.max((String(current * PAGESIZE).length - 2) * 13, 0),
          fixed: 'left',
          align: 'center',
          render: (_: any, __: any, idx: number) => (current - 1) * PAGESIZE + idx + 1,
        },
        {
          title: '登记起始日',
          sorter: true,
          defaultSortOrder: 'descend',
          sortDirections: ['descend', 'ascend'],
          key: 'startDate',
          dataIndex: 'startDate',
          align: 'center',
          fixed: 'left',
          width: 106,
          render(text: any) {
            return <TextWrap>{foramtTableDate(text)}</TextWrap>;
          },
        },
        {
          title: '承租人',
          sorter: true,
          key: 'lessee',
          dataIndex: 'lessee',
          align: 'left',
          fixed: 'left',
          width: 232,
          wrapLine: true,
          render(data: Record<string, string>[], row: Record<string, any>) {
            let result: any;
            if (Array.isArray(data) && data.length !== 0) {
              const firstObj = isObject(data[0]) ? data[0] : {};
              const { lessee, lesseeTagOrder, lesseeCode10 } = firstObj;
              const tags = handTags(lesseeTagOrder || '', '', '', '', true);
              result = (
                <CompanyEllipsis
                  item={row}
                  getHeight={true}
                  keyword={restParams.keyWord}
                  text={lessee || '-'}
                  tags={tags}
                  hoverLink={!!lesseeCode10}
                  style={{ width: 'auto' }}
                  code={lesseeCode10}
                  handTags={handTags}
                  data={data}
                  rate={''}
                  tagName="lesseeTagOrder"
                  codeName="lesseeCode10"
                  listName="lessee"
                  itCodeName="lesseeCode8"
                  oneLineWidth={200}
                />
              );
            } else result = '-';
            return result;
          },
        },
        {
          title: '出租人',
          sorter: true,
          key: 'leaser',
          dataIndex: 'leaser',
          align: 'left',
          fixed: 'left',
          width: 232,
          wrapLine: true,
          render(data: Record<string, string>[]) {
            let result: any;
            if (Array.isArray(data) && data.length !== 0) {
              const firstObj = isObject(data[0]) ? data[0] : {};
              const { leaser, leaserTagOrder, leaserCode10 } = firstObj;
              const tags = handTags(leaserTagOrder || '', '', '', '', false);
              result = (
                <CompanyEllipsis
                  text={leaser || '-'}
                  tags={tags}
                  keyword={restParams.keyWord}
                  hoverLink={!!leaserCode10}
                  style={{ width: 'auto' }}
                  code={leaserCode10}
                  handTags={handTags}
                  data={data}
                  rate={''}
                  tagName="leaserTagOrder"
                  codeName="leaserCode10"
                  listName="leaser"
                  itCodeName="leaserCode8"
                  oneLineWidth={200}
                />
              );
            } else result = '-';
            return result;
          },
        },
        {
          title: '登记金额(万元)',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          // 这里用到了两个值，key是中台给的
          key: 'registeredMoney',
          dataIndex: 'financedMoney',
          align: 'right',
          width: 128,
          render(text: string, record: Record<string, any>) {
            if (Number(text || record.assetValue) === 0) return '-';
            return <TextWrap>{handleTableDataFormat(text || record.assetValue, { thousands: true })}</TextWrap>;
          },
        },
        {
          title: '期限',
          // sorter: true,
          // sortDirections: ['descend', 'ascend'],
          key: 'deadline',
          dataIndex: 'deadline',
          align: 'right',
          width: 68,
          render(text: string) {
            return text ? (
              <Ellipsis
                text={<TextWrap showPopContent={text}>{text || '-'}</TextWrap>}
                getPopupContainer={document.getElementById('area-company-将到期事件') as HTMLDivElement}
              />
            ) : (
              '-'
            );
          },
        },
        {
          title: '披露日期',
          sorter: true,
          sortDirections: ['descend', 'ascend'],
          key: 'publishDate',
          dataIndex: 'publishDate',
          align: 'center',
          width: 93,
          render(text: string) {
            return <TextWrap>{foramtTableDate(text)}</TextWrap>;
          },
        },
        {
          title: '登记到期日',
          sorter: true,
          key: 'endDate',
          dataIndex: 'endDate',
          align: 'center',
          width: 106,
          render(text: any) {
            return <TextWrap>{foramtTableDate(text)}</TextWrap>;
          },
        },
        {
          title: '登记状态',
          sorter: true,
          key: 'registerStatus',
          dataIndex: 'registerStatus',
          align: 'center',
          width: 93,
          render(text: any) {
            if (text && text !== '空值') {
              return <TextWrap>{text}</TextWrap>;
            }
            return '-';
          },
        },
        {
          title: '国标行业',
          key: 'guoBiaoXType',
          // 门类：guoBiaoType，大类：guoBiaoFType，中类guoBiaoZType，小类guoBiaoXType
          dataIndex: 'guoBiaoXType',
          align: 'left',
          width: 220,
          wrapLine: true,
          render: getIndustryRender(['guoBiaoType', 'guoBiaoFType', 'guoBiaoZType', 'guoBiaoXType']),
        },
        {
          title: '所属地区',
          key: 'lesseeArea',
          dataIndex: 'lesseeArea',
          align: 'left',
          width: 189,
          render(text: string) {
            // const area = [];
            // if (record.province && record.province !== '-') area.push(handleProvinceAlias(text));
            // if (record.city && record.city !== '-') area.push(record.city);
            // if (record.county && record.county !== '-') area.push(record.county);
            return text ? (
              <TextWrap showPopContent={text}>
                <Ellipsis
                  text={text}
                  getPopupContainer={document.getElementById('area-company-将到期事件') as HTMLDivElement}
                />
              </TextWrap>
            ) : (
              '-'
            );
          },
        },
      ].map((o, i) => ({ ...o, resizable: !!i })),
    [current, handTags, restParams.keyWord],
  );
};
