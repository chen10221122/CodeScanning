import { useMemo, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import { Popover, message } from 'antd';
import styled from 'styled-components';

import AddBtn from '@/components/combinationDropdownSelect/addBtn';
import { Image } from '@/components/layout';
import { PAGESIZE } from '@/pages/area/areaCompany/const';
import CompanyWithSpecialTags from '@/pages/area/areaFinancingBoard/components/Company/CompanyWithSpecialTags';
import HouseholdLink from '@/pages/area/areaFinancingBoard/components/Company/HouseholdLink';
import type { DetailColumnsProps } from '@/pages/area/areaFinancingBoard/types';
import NameFold, { FoldType } from '@/pages/bond/overdue/components/foldDropMenu';

export default function useColumns({ curPage, tableRef, data }: DetailColumnsProps) {
  const wrapRef = useRef<any>(null);

  const onCopyBtnClick = useMemoizedFn((key) => {
    navigator.clipboard.writeText(data.map((o: Record<string, string>) => o[key]).join('\n'));
    message.success('复制成功');
  });

  const columns = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        fixed: 'left',
        width: Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42),
        className: 'pdd-8',
        render: (_: any, __: any, i: number) => {
          return (curPage - 1) * PAGESIZE + i + 1;
        },
      },
      {
        title: (
          <Control ref={wrapRef}>
            截止日期
            <div></div>
            <Popover
              placement="bottom"
              arrowPointAtCenter
              overlayClassName="factoring_tip_special"
              content={<div> 票据承兑逾期统计数据的截止时点 </div>}
            >
              <Image
                width={12}
                height={12}
                style={{ cursor: 'pointer', position: 'relative', top: '1px', marginLeft: '4px' }}
                src={require('../images/question@2x.png')}
              ></Image>
            </Popover>
          </Control>
        ),
        align: 'center',
        sorter: true,
        defaultSortOrder: 'descend',
        key: 'endDate',
        dataIndex: 'endDate',
        width: 110,
        fixed: true,
        resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: () => (
          <>
            承兑人
            <AddBtn
              container={() => tableRef.current}
              text={'承兑人'}
              onClickWithHasPower={() => {
                onCopyBtnClick('acceptor');
              }}
            />
          </>
        ),
        align: 'left',
        key: 'acceptor',
        dataIndex: 'acceptor',
        width: 232,
        fixed: true,
        resizable: { max: 940 - Math.max(`${curPage * PAGESIZE}`.length * 10 + 22, 42) },
        wrapLine: true,
        render: (text: string, row: any, __: number) => {
          return (
            <CompanyWithSpecialTags
              type={'company'}
              data={{
                ...row,
                code: row.acceptorItCode2,
                name: text,
                tags: row.acceptorTag,
              }}
            />
          );
        },
      },
      {
        title: '历史披露次数',
        align: 'right',
        key: 'historyDisclosureNum',
        dataIndex: 'historyDisclosureNum',
        width: 102,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: (
          <Control ref={wrapRef}>
            实控人/城投
            <div></div>
            <Popover
              placement="bottom"
              arrowPointAtCenter
              overlayClassName="factoring_tip"
              content={<div> 如承兑人为城投子公司，显示城投公司名称；其他情况显示实控人</div>}
            >
              <Image
                width={12}
                height={12}
                style={{ cursor: 'pointer', position: 'relative', top: '1px', marginLeft: '4px' }}
                src={require('../images/question@2x.png')}
              ></Image>
            </Popover>
          </Control>
        ),
        align: 'left',
        key: 'appUrbanOrWebActualUrbans',
        dataIndex: 'appUrbanOrWebActualUrbans',
        width: 194,
        resizable: true,
        wrapLine: true,
        render: (_: string, record: any, __: number) => {
          let nameArry: string[] = [],
            codeArry: string[] = [];
          record.controlOrCityInvest?.forEach((item: any) => {
            nameArry.push(item.actualControllerName);
            codeArry.push(item.actualControllerCode);
          });
          if (!nameArry[0]) return '-';
          return (
            <NameFold
              tabId="tableWrap"
              type={FoldType.CF}
              splitSymbol=","
              clampNumber={3}
              nameList={nameArry}
              codeList={codeArry}
              relation={false}
              relationStatus={''}
              keyword={''}
            />
          );
        },
      },
      {
        title: '所属集团户',
        align: 'left',
        key: 'group',
        dataIndex: 'group',
        width: 139,
        resizable: true,
        wrapLine: true,
        render: (text: string, record: any, __: number) => {
          return <HouseholdLink code={record?.groupCode} text={text} />;
        },
      },
      {
        title: (
          <SortFieldWrapper row={2} special={true}>
            <span title="累计逾期发生额(万元)">
              <span>
                累计逾期发生额(万元)
                <Popover
                  placement="bottom"
                  arrowPointAtCenter
                  overlayClassName="factoring_tip_special"
                  content={<div> 截至披露日上一月月末，近5年内发生过逾期的全部商业汇票总金额 </div>}
                >
                  <Image
                    width={12}
                    height={12}
                    style={{ cursor: 'pointer', position: 'relative', top: '-1px', marginLeft: '4px' }}
                    src={require('../images/question@2x.png')}
                  ></Image>
                </Popover>
              </span>
            </span>
          </SortFieldWrapper>
        ),
        align: 'right',
        key: 'sumOverdueAmount',
        dataIndex: 'sumOverdueAmount',
        width: 119,
        sorter: true,
        resizable: true,
        wrapLine: true,
        render: (text: any) => {
          return text || '未披露';
        },
      },
      {
        title: (
          <SortFieldWrapper row={2} special={true}>
            <span>
              <span>
                逾期余额(万元)
                <Popover
                  placement="bottom"
                  arrowPointAtCenter
                  overlayClassName="factoring_tip_special"
                  content={<div> 截至披露日上一月月末，承兑人已逾期但未结清的商业汇票总金额 </div>}
                >
                  <Image
                    width={12}
                    height={12}
                    style={{ cursor: 'pointer', position: 'relative', top: '-1px', marginLeft: '4px' }}
                    src={require('../images/question@2x.png')}
                  ></Image>
                </Popover>
              </span>
            </span>
          </SortFieldWrapper>
        ),
        align: 'right',
        key: 'overdueBalance',
        dataIndex: 'overdueBalance',
        width: 113,
        sorter: true,
        resizable: true,
        wrapLine: true,
        render: (text: any) => {
          return text || '未披露';
        },
      },
      {
        title: (
          <SortFieldWrapper row={2} special={true}>
            <span>
              <span>
                累计承兑发生额(万元)
                <Popover
                  placement="bottomRight"
                  arrowPointAtCenter
                  overlayClassName="factoring_tip_special"
                  content={<div> 当年累计承兑发生额，即当年1月1日至披露日上一月月末累计 </div>}
                >
                  <Image
                    width={12}
                    height={12}
                    style={{ cursor: 'pointer', position: 'relative', top: '-1px', marginLeft: '4px' }}
                    src={require('../images/question@2x.png')}
                  ></Image>
                </Popover>
              </span>
            </span>
          </SortFieldWrapper>
        ),
        align: 'right',
        key: 'sumAcceptAmount',
        dataIndex: 'sumAcceptAmount',
        width: 119,
        sorter: true,
        resizable: true,
        wrapLine: true,
        render: (text: any) => {
          return text || '未披露';
        },
      },
      {
        title: (
          <SortFieldWrapper row={2} special={true}>
            <span>
              <span>
                承兑余额(万元)
                <Popover
                  placement="bottomRight"
                  arrowPointAtCenter
                  overlayClassName="factoring_tip_special"
                  content={<div> 截至披露日上一月月末，承兑人已承兑但未结清的商业汇票总金额 </div>}
                >
                  <Image
                    width={12}
                    height={12}
                    style={{ cursor: 'pointer', position: 'relative', top: '-1px', marginLeft: '4px' }}
                    src={require('../images/question@2x.png')}
                  ></Image>
                </Popover>
              </span>
            </span>
          </SortFieldWrapper>
        ),
        align: 'right',
        key: 'AcceptBalance',
        dataIndex: 'AcceptBalance',
        width: 113,
        sorter: true,
        resizable: true,
        wrapLine: true,
        render: (text: any) => {
          return text || '未披露';
        },
      },
      {
        title: '国标行业',
        align: 'left',
        key: 'industryStr',
        dataIndex: 'industryStr',
        width: 162,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '企业性质',
        align: 'center',
        key: 'companyNature',
        dataIndex: 'companyNature',
        width: 99,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: '注册地',
        align: 'left',
        key: 'registerPlace',
        dataIndex: 'registerPlace',
        width: 162,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
      {
        title: (
          <Control ref={wrapRef}>
            披露日期
            <div></div>
            <Popover
              placement="bottom"
              arrowPointAtCenter
              overlayClassName="factoring_tip_special"
              content={<div> 逾期统计数据的披露日 </div>}
            >
              <Image
                width={12}
                height={12}
                style={{ cursor: 'pointer', position: 'relative', top: '1px', marginLeft: '4px' }}
                src={require('../images/question@2x.png')}
              ></Image>
            </Popover>
          </Control>
        ),
        align: 'center',
        key: 'disclosureDate',
        dataIndex: 'disclosureDate',
        width: 102,
        resizable: true,
        wrapLine: true,
        render: (text: string) => text || '-',
      },
    ],
    [curPage, tableRef, onCopyBtnClick],
  );

  return columns;
}

const Control = styled.div`
  display: flex;
  -webkit-box-align: baseline;
  align-items: baseline;
  -webkit-box-pack: center;
  justify-content: center;
`;

export const SortFieldWrapper = styled.div<{ row: number; special?: boolean }>`
  display: inline-flex;
  cursor: pointer;
  align-items: ${(props: { row: number; special?: boolean }) => (props.special ? 'center' : 'self-start')};

  span {
    white-space: normal;
    overflow: hidden; /*必须结合的属性,当内容溢出元素框时发生的事情*/
    text-overflow: ellipsis; /*可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 。*/
    display: -webkit-box; /*必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。*/
    -webkit-line-clamp: ${(props: { row: any }) => props.row}; /*用来限制在一个块元素显示的文本的行数。*/
    -webkit-box-orient: vertical; /*必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。*/
    text-align: ${(props: { row: number; special?: boolean }) => (props.special ? 'left' : '')};
  }

  .special {
    display: flex;
    flex-direction: column;
    text-align: right;
  }
`;
