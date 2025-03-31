import { useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { Icon } from '@/components';
// import className from 'classnames';

// import Overview from '@/pages/area/areaF9/components/overview';

import { useCtx } from '../context';
import ToAreaCompare from '../ToAreaCompare';
import { AreaShareParams, RegionData, RenderableIndicator } from '../utils';

// 列描述对象类型
interface Column {
  [key: string]: any;
}
type Colums = Array<Column>;

const MAX_COLS_INDEX = 6;

/**
 * 从一行数据中取得所有地区信息并转换为可分享地区数据
 * @param row Table 组件 每行的数据
 */
const getAreasFromRow = (row: RenderableIndicator): AreaShareParams => {
  let areas: AreaShareParams = {
    areas: [],
    codes: [],
    year: '',
  };
  Object.keys(row).forEach((key) => {
    const item: any = row[key];
    // 当 item 为 RegionData 时，
    // if (item && typeof item !== 'string' && typeof item !== 'boolean') {
    //   areas.codes.push(item.code + '');
    //   areas.areas.push(item.name);
    //   areas.year = item.year;
    // }
    if (key.indexOf('code') !== -1) {
      areas.codes.push(item + '');
    } else if (key.indexOf('name') !== -1) {
      areas.areas.push(item);
    } else if (key === 'year0') {
      areas.year = item;
    }
  });
  return areas;
};

/**
 * 构建用于转跳的链接
 * @param e 点击事件
 * @param areas 需要分享的对象
 */
const buildCompareLink = (areas: AreaShareParams) => {
  let link = `?year=${areas.year}&codes=${encodeURIComponent(areas.codes.join(','))}&areas=${encodeURIComponent(
    areas.areas.join(','),
  )}`;
  return link;
};

export default function useColumns({ beforeLeave, openIndictorModal }: any) {
  const { update } = useCtx();

  const openMoreAreaModals = useMemoizedFn((rows: any, _region: any) => {
    update((d) => {
      d.isOpenModals = true;
      d.modalRow = {
        title: rows.title,
        indicName2: rows.indicName2,
      };
    });
  });

  const columns = useMemo(() => {
    // 指标列
    let cols: Colums = [
      {
        title: (
          <CustomTitle>
            <div className="edit-title" onClick={openIndictorModal}>
              <span className="edit-title-text">自定义指标</span>
              <div className="edit-box">
                <Icon className="edit" image={require('@/assets/images/area/edit.png')} />
                <span>编辑</span>
              </div>
              <Icon className="vip-tag" image={require('@/assets/images/power/vip.png')} />
            </div>
          </CustomTitle>
        ),
        align: 'left',
        dataIndex: 'title',
        key: 'title',
        fixed: 'left',
        width: '190px',
        className: 'similar-title similar-title-padding similar-region-cell-padding',
        render: (text: string, row: any) => {
          return (
            <>
              <div>{text}</div>
            </>
          );
        },
      },
      // 本地数据列
      {
        title: '本地区',
        children: [
          {
            title: '地区',
            dataIndex: 'regionSimpleName0',
            key: 'regionSimpleName0',
            width: 96,
            ellipsis: true,
            render: (text: any, rows: any) => {
              return <OneLine title={rows.name0}>{text}</OneLine>;
            },
          },
          {
            title: '数值',
            dataIndex: 'value0',
            key: 'value0',
            align: 'right',
            width: 108,
            ellipsis: true,
          },
        ],
      },
    ];

    let similarCol: any = {
      title: '相似地区',
      children: [],
    };
    for (let i = 1; i < MAX_COLS_INDEX; i++) {
      similarCol.children.push(
        {
          title: '地区',
          dataIndex: `name${i}`,
          key: `name${i}`,
          width: 96,
          ellipsis: true,
          render: (value: any, _row: any) => {
            return <OneLine title={value}>{_row[`regionSimpleName${i}`] || '-'}</OneLine>;
          },
        },
        {
          title: '数值',
          dataIndex: `value${i}`,
          key: `value${i}`,
          width: 108,
          align: 'right',
          ellipsis: true,
          render: (value: any, _row: any) => {
            return value || '-';
          },
        },
        {
          title: '偏离度',
          dataIndex: `deviateDegree${i}`,
          key: `deviateDegree${i}`,
          width: 61,
          align: 'right',
          ellipsis: true,
          render: (value: any, _row: any) => {
            // console.log('-----', value, row);
            const degree = Number(value) || 0;
            return (
              <div style={{ color: degree ? (degree > 0 ? '#FE3A2F' : '#14BA70') : '#262626' }}>
                {value ? degree : '-'}
              </div>
            );
          },
        },
      );
    }
    cols.push(similarCol);
    // 转跳列
    cols.push(
      {
        title: '更多地区/去比较',
        align: 'center',
        key: 'operation',
        width: 114,
        fixed: 'right',
        // ellipsis: false,
        render: (_region: RegionData, row: any) => {
          return (
            <RightButton>
              <div className="left">
                {row.name5 ? (
                  <div className="more" onClick={() => openMoreAreaModals(row, _region)}>
                    更多
                  </div>
                ) : (
                  <div>-</div>
                )}
              </div>
              <ToAreaCompare
                areas={getAreasFromRow(row)}
                beforeLeave={beforeLeave}
                query={buildCompareLink(getAreasFromRow(row))}
              />
            </RightButton>
          );
        },
      },
      // {
      //   title: '地区对比',
      //   align: 'center',
      //   dataIndex: '',
      //   width: 74,
      //   fixed: 'right',
      //   // className: 'similar-title similar-title-padding similar-region-share',
      //   render: (_region: RegionData, row: any) => {
      //     return (
      //       <ToAreaCompare
      //         areas={getAreasFromRow(row)}
      //         beforeLeave={beforeLeave}
      //         query={buildCompareLink(getAreasFromRow(row))}
      //       />
      //     );
      //   },
      // },
    );
    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beforeLeave]);

  return { columns };
}

const OneLine = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CustomTitle = styled.div`
  .edit-title {
    display: flex;
    align-items: center;
    cursor: pointer;
    .edit-title-text {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 600;
      color: #262626;
    }
    .edit-box {
      margin-left: 4px;
      width: 54px;
      height: 20px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      &::after {
        content: '';
        display: block;
        position: absolute;
        width: 200%;
        height: 200%;
        top: 0;
        left: 0;
        border: 1px solid #abd1ff;
        border-radius: 20px;
        transform: scale(0.5);
        transform-origin: 0 0;
      }
      .edit {
        width: 11px;
        height: 11px;
        font-size: 11px;
        margin: 0 4px 0 0;
      }
      > span {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #0171f6;
      }
    }
    .vip-tag {
      width: 12px;
      height: 12px;
      font-size: 12px;
      margin: 2px 0 0 4px;
    }
  }
`;

const RightButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    min-width: 25px;
    .more {
      color: #025cdc;
      cursor: pointer;
      font-family: PingFangSC, PingFangSC-Regular;
      line-height: 18px;
    }
  }
`;
