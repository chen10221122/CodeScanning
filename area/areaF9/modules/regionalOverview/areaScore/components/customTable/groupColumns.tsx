import { useMemo } from 'react';

import { Popover } from '@dzh/components';
import { useMemoizedFn } from 'ahooks';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

import Icon from '@/components/icon';
import IndicHeaderCell from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/table/IndicHeaderCell';
import { tagList, pointText } from '@/pages/area/areaF9/modules/regionalOverview/areaScore/const';

export const useColumns = (
  handleShowEChartModel: any,
  setIsExpandAll: any,
  isExpandAll: boolean,
  selected: string[],
) => {
  const ordinaryRender = (text: string, row: any) => {
    return <Oneline className={`indi-name${row.level}`}>{text || '-'}</Oneline>;
  };

  const showModel = useMemoizedFn((params) => {
    handleShowEChartModel(params);
  });

  const columns = useMemo(() => {
    return [
      {
        title: <IndicHeaderCell isExpandAll={isExpandAll} setIsExpandAll={setIsExpandAll} />,
        dataIndex: 'head',
        width: 226,
        fixed: 'left',
        align: 'left',
        render: (text: string, row: any) => {
          const { level, children, weight, description } = row;
          // if (children) console.log(text, 'isExpand--', isExpand);
          let isExpand = selected.includes(row.key);
          return (
            <IndicatorName>
              <span className={`indi-name indi-name${level}`}>{`${text}${weight ? `(${weight})` : ''}`}</span>
              {children ? (
                <Icon
                  size={10}
                  image={require(level === 1 ? '../../imgs/expand.png' : '../../imgs/expand2.png')}
                  style={{ transform: isExpand ? 'unset' : 'rotate(-90deg)' }}
                />
              ) : null}
              {level && level > 1 ? (
                <div
                  onClick={() => {
                    showModel(row);
                  }}
                >
                  <Icon
                    size={12}
                    image={require('../../imgs/chart.png')}
                    style={{ verticalAlign: '-1px', cursor: 'pointer' }}
                  />
                </div>
              ) : null}

              {description ? (
                <div style={{ cursor: 'pointer' }}>
                  <Popover placement="right" content={<div>{description}</div>} trigger="hover">
                    <img
                      src={require('../../imgs/ask.png')}
                      alt=""
                      style={{ width: '12px', height: '12px', marginLeft: '4px' }}
                    />
                  </Popover>
                </div>
              ) : null}
            </IndicatorName>
          );
        },
      },
      {
        title: '得分',
        dataIndex: 'score',
        key: 'score',
        width: 56,
        align: 'right',
      },
      {
        title: '评分位置',
        dataIndex: 'position',
        key: 'position',
        width: 215,
        align: 'center',
        render: (text: string, row: any) => {
          let value = text;
          let num = Number(value && +value.split('%')[0]);
          let level = num === 100 ? 3 : Math.floor(num / 25);
          let list = cloneDeep(tagList);
          let isShowImg = Number.isInteger(level) && level >= 0;

          return (
            <div className="local-item">
              <div className="lines">
                {list.map((item) => (
                  <div className="line" key={item.color} style={{ background: item.color }}></div>
                ))}
                {isShowImg ? (
                  <img style={{ left: `${num - 5}%` }} src={list[level].img} alt="" className={list[level].className} />
                ) : null}
              </div>
              <div className="percent">{value}</div>
            </div>
          );
        },
      },
      {
        title: '指标值',
        dataIndex: 'value',
        key: 'value',
        width: 114,
        align: 'right',
        render: (value: string, row: any) => {
          const { level, source } = row;
          let unit = row.unit || '';
          return source === '2' ? (
            <Popover placement="bottomRight" content={<div>{pointText}</div>} trigger="hover">
              <OneLocalLine className={`local-title-level${level} pointer`}>
                <div className="point-box">
                  <div className="point"></div>
                </div>
                {value ? `${value}${unit}` : '-'}
              </OneLocalLine>
            </Popover>
          ) : value ? (
            `${value}${unit}`
          ) : (
            '-'
          );
        },
      },
      {
        title: '全省',
        dataIndex: 'provinceRank',
        key: 'provinceRank',
        width: 70,
        align: 'right',
      },
      {
        title: '全国',
        dataIndex: 'nationalRank',
        key: 'nationalRank',
        width: 84,
        align: 'right',
      },
    ].map((d) => ({
      ...d,
      resizable: true,
      ellipsis: true,
      render: d.render || ordinaryRender,
    })) as any;
  }, [isExpandAll, selected, setIsExpandAll, showModel]);

  return columns;
};

const IndicatorName = styled.div`
  display: flex;
  align-items: center;
  .indi-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .indi-name1 {
    color: #ff7500;
  }
  i {
    margin-left: 4px;
  }
`;

const Oneline = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &.indi-name1 {
    color: #ff7500;
  }
`;

const OneLocalLine = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // position: relative;
  cursor: pointer;
  .point-box {
    position: absolute;
    right: 10px;
    top: 5px;

    .point {
      width: 5px;
      height: 5px;
      border-radius: 5px;
      background: red;
      border: 1px solid #ffffff;
      box-sizing: content-box;
    }
  }
`;
