import { useState, useMemo, useRef } from 'react';
// import { Link } from 'react-router-dom';

import { TableColumnsType } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import dayJs from 'dayjs';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { formatDate } from '@/utils/date';
import { highlight } from '@/utils/dom';

import { ModuleEnum, PAGESIZE } from '../../constant';
import { conditionType } from '../../index';
import CompanyPopover from './companyPopover';

// interface NewsModalInfoInter {
//   /**新闻id */
//   id: string;
//   /**新闻类型 */
//   type: string;
//   forceType?: string;
// }
// interface TagInfoInter {
//   /**标签名 */
//   name: string;
//   /**字体颜色 */
//   fontColor: string;
//   /**背景色 */
//   background: string;
// }

const Columns = ({
  // tableWidth,
  moduleType,
  current,
  keyWord,
  // regionCode,
  condition,
  handleTabChange,
  handleAreaItemClick,
  openModal,
}: {
  tableWidth?: number;
  moduleType?: string;
  current: number;
  keyWord: string;
  // regionCode: string;
  condition: conditionType;
  handleTabChange: (data: any[], type?: string) => void;
  handleAreaItemClick: (value: string, type?: string) => void;
  openModal: Function;
}) => {
  const [modalvisible, setModalvisible] = useState(false);
  const valRef = useRef<any>();

  const handelCellChange = useMemoizedFn((record) => {
    valRef.current =
      moduleType === ModuleEnum.AREA
        ? condition.financeType
        : moduleType === ModuleEnum.INDUSTRY
        ? condition.swBusinessType
        : condition.riskType;
    if (record.code === '666666' || valRef.current === record.code) return;
    handleTabChange([{ name: record.text, id: record.code }], 'table');
  });

  const handleClose = useMemoizedFn(() => setModalvisible(false));

  const columnsList = useMemo(() => {
    const comlumnCfg: TableColumnsType<any> = [
      {
        title: '序号',
        key: 'idx',
        width: 42,
        fixed: 'left',
        className: 'order',
        align: 'center',
        render: (_: any, __: any, idx: number) => (current - 1) * PAGESIZE + idx + 1,
      },
      {
        title: '时间',
        key: 'newsDate',
        width: 96,
        fixed: 'left',
        render: (date: string) =>
          date ? (
            <div title={formatDate(dayJs(date).format('YYYYMMDDHHmmss'))} className="tabDate">
              {formatDate(dayJs(date).format('YYYYMMDDHHmmss'))}
            </div>
          ) : (
            '-'
          ),
      },
      {
        title: '标题',
        key: 'title',
        // width: moduleType !== ModuleEnum.COMPANY ? calcWidth(430) : calcWidth(312),
        width: moduleType === ModuleEnum.COMPANY ? '34%' : '43%',
        fixed: 'left',
        // resizable: { max: 648 },
        render: (title: string, row: any, index: number) => (
          <TitleSpan
            title={title}
            className="tabTitle"
            isTop={row.topType === 1}
            onClick={() => {
              openModal(row, index);
              // jumpLink(row);
            }}
          >
            {highlight(title, keyWord)}
          </TitleSpan>
        ),
      },
      {
        title: '关联地区',
        className: 'one-row-ellipsis',
        width: moduleType === ModuleEnum.COMPANY ? '16%' : '15%',
        /** @ts-ignore */
        render: (_, record) => {
          return !isEmpty(record?.areaClassifyMore)
            ? record.areaClassifyMore.map((item: Record<'classifyName' | 'classifyCode', string>, index: number) => (
                <>
                  {index > 0 && '-'}
                  <LinkStyle onClick={() => handleAreaItemClick(item.classifyCode)}>{item.classifyName}</LinkStyle>
                </>
              ))
            : '-';
        },
      },
      {
        title: '来源',
        key: 'source',
        width: moduleType === ModuleEnum.COMPANY ? '16%' : '16%',
      },
    ];
    if (moduleType === ModuleEnum.AREA) {
      comlumnCfg.splice(4, 0, {
        title: '分类',
        key: 'labeltag',
        width: '14%',
        render: (label: any, record) =>
          record.label ? (
            <span
              className={record.label.code === '666666' ? '' : 'span-label'}
              onClick={() => handelCellChange(record.label)}
              title={label}
            >
              {label || '-'}
            </span>
          ) : (
            '-'
          ),
      });
    } else if (moduleType === ModuleEnum.INDUSTRY) {
      comlumnCfg.splice(3, 0, {
        title: '关联行业',
        key: 'labeltag',
        width: '18%', //无设计稿 字段
        render: (label, record) =>
          record.label ? (
            <span
              className={record.label.code === '666666' ? '' : 'span-label'}
              onClick={() => handelCellChange(record.label)}
              title={label}
            >
              {label || '-'}
            </span>
          ) : (
            '-'
          ),
      });
    } else {
      comlumnCfg.splice(
        3,
        0,
        {
          title: '关联企业',
          key: 'shortname',
          width: '18%',
          render: (title: string, row: any) => {
            const relatedOrgs = row.relatedOrgs,
              otherOrgs = row.otherOrgs;
            const nameList = relatedOrgs?.length
              ? relatedOrgs.map((el: any) => el.name)
              : otherOrgs?.length
              ? [otherOrgs[0].name]
              : [];
            return (
              <CompanyPopover
                nameList={nameList}
                urlList={
                  relatedOrgs?.length
                    ? relatedOrgs.map(
                        (item: any) => `/detail/enterprise/overview?type=company&code=${item.code}#企业速览`,
                      )
                    : otherOrgs?.length
                    ? [`/detail/enterprise/overview?type=company&code=${otherOrgs[0].code}#企业速览`]
                    : []
                }
              />
            );
          },
        },
        /* {
          title: '企业性质',
          dataIndex: 'companyType',
          align: 'left',
          key: 'companyType',
          width: 88,
          resizable: true,
          render: (title: string) => {
            return title || '-';
          },
        }, */
        {
          title: '一级分类',
          key: 'label1',
          width: '12%',
          render: (label: any, record) => {
            return (
              <span
                // className={record?.label1?.code === '666666' ? '' : 'span-label'}
                // onClick={() => handelCellChange(record.label1)}
                title={record?.label1?.text}
              >
                {record?.label1?.text || '-'}
              </span>
            );
          },
        },
        {
          title: '二级分类',
          key: 'labeltag',
          width: '12%',
          render: (label: any, record) => {
            return (
              <span
                className={record.label?.code === '666666' ? '' : 'span-label'}
                onClick={() => handelCellChange(record.label)}
                title={label}
              >
                {label || '-'}
              </span>
            );
          },
        },
        {
          title: '重要性',
          key: 'importanceEptTag',
          width: 64,
          render: (title: string) => {
            return (
              <div
                title={title}
                className={cn({ redTxt: title === '重要' })}
                // onClick={() => {
                //   handelCellClick(title === '重要' ? '1' : '0', 'importanceEptTag');
                // }}
              >
                {title || '-'}
              </div>
            );
          },
        },
        {
          title: '正负面',
          key: 'negativeEptTag',
          width: 64,
          render: (title: any) => {
            return (
              <div
                title={title}
                className={cn({ redTxt: title === '负面' })}
                // onClick={() => {
                //   if (title === '中性') return;
                //   handelCellClick(title === '正面' ? '1' : '-1', 'negativeEptTag');
                // }}
              >
                {title || '-'}
              </div>
            );
          },
        },
      );
    }
    return comlumnCfg.map((o) => ({ ...o, align: o.align || 'left', dataIndex: o.key }));
  }, [
    moduleType,
    current,
    keyWord,
    // jumpLink,
    // regionCode,
    handelCellChange,
    openModal,
    // handelCellClick,
    handleAreaItemClick,
  ]);
  return { columnsList, modalvisible, handleClose };
};

export default Columns;

const TitleSpan = styled.span<{ isTop: boolean }>`
  &::before {
    content: '';
    display: ${({ isTop }) => (isTop ? 'inline-block' : 'none')};
    position: relative;
    top: 3px;
    width: 26px;
    height: 15px;
    margin-right: 4px;
    background: url(${require('./topType.svg')}) no-repeat center;
  }
`;
const LinkStyle = styled.span`
  cursor: pointer;
  &:hover {
    color: #025cdc !important;
  }
`;
