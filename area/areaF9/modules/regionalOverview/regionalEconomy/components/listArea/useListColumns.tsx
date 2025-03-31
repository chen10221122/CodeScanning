import { useMemo } from 'react';

import { Popover } from '@dzh/components';
import { cloneDeep } from 'lodash';
import styled from 'styled-components';

// import attention from '@/assets/images/area/attention.svg';
import IconLineChartSvg from '@/assets/images/area/icon_line_chart.svg';
import IndexSvg from '@/assets/images/area/index.svg';
import TipSvg from '@/assets/images/area/tip_gray_icon.svg';
import { Icon } from '@/components';
// import { Popover } from '@/components/antd';
import { ScreenType, Screen, Options } from '@/components/screen';
import { CaliberNotes } from '@/pages/area/areaF9/style';
// import Table from '@/components/tableFinance';
import { formatNumber } from '@/utils/format';

import { ChartType } from '../../types';
import ListTableCell from './tableCell';

const iconStyle = { width: 12, height: 12, marginLeft: '4px', verticalAlign: '-2px' };
const currentYear = new Date().getFullYear().toString();
const IconChart = {
  [ChartType['1']]: IconLineChartSvg,
  [ChartType['2']]: IndexSvg,
};
const options: Options[] = [
  {
    title: '指标',
    option: {
      type: ScreenType.MULTIPLE,
      children: [
        {
          name: '累计值',
          value: '1',
        },
        {
          name: '当月值',
          value: '2',
        },
        {
          name: '当季值',
          value: '3',
        },
      ],
    },
  },
];

interface Props {
  /** 列表的年份列表 */
  years: string[];
  /** 是否溯源 */
  traceSource: boolean;
  /** 打开趋势图弹窗方法 */
  handleShowModal: (row: any, name: any, data: any, unit: any) => void;
  activeTab: number;
  onScreenChange: (this: any, row: any) => void;
  /** 打开指标弹窗方法 */
  handleOpenMetric: () => void;
  /** 当前悬浮行的key */
  hoverRowKey: string;
  /** 表格的点击事件：当前年份列，行数据，是否为更新值单元格 */
  handleCellClick: (year: any, row: any, isUpdateItem: any, event: any) => void;
  /** 更新提示单元格的参数包装方法 */
  handleTblCell: (param: Record<string, any>) => Record<string, any>;
  /** 各指标是否支持入参修改的map */
  indicatorNeedConfigMap: Record<string, boolean>;
  /** 列表指标的入参map */
  listHeadParamMap: Record<string, any>;
  traceInfo?: any;
}

export default function useListColumns({
  years,
  traceSource,
  handleShowModal,
  activeTab,
  onScreenChange,
  handleOpenMetric,
  hoverRowKey,
  handleCellClick,
  handleTblCell,
  indicatorNeedConfigMap,
  listHeadParamMap,
  traceInfo,
}: Props) {
  return useMemo(() => {
    const columns: Record<string, any>[] = [
      {
        title:
          activeTab === 1 ? (
            <span className="edit-title">
              自定义指标
              <span className="edit-btn" onClick={handleOpenMetric}>
                <span className="edit-icon" />
                编辑
              </span>
              <Icon style={iconStyle} image={require('@/assets/images/power/vip.png')} />
            </span>
          ) : (
            <Screen options={options} onChange={onScreenChange} />
          ),
        align: 'left',
        fixed: true,
        width: 234,
        className: 'padding-left24 align-left',
        dataIndex: 'paramName',
        render: (text: any, row: any) => {
          const dataobj = cloneDeep(row.paramDetailArr) || {};
          /** 不展示预期目标列数据 */
          if (currentYear in dataobj) {
            delete dataobj[currentYear];
          }
          const hasHisitoryData = Object.keys(dataobj).length > 0;

          if (row.specialTitle) {
            return <span className="orange-title">{row.specialTitle}</span>;
          }
          return (
            <span
              className="metric-title"
              onClick={() => {
                row?.hasChart && hasHisitoryData && handleShowModal(row, text, dataobj, row?.unit);
              }}
            >
              <span>{text}</span>
              {row?.hasChart && row?.chartType && hasHisitoryData ? (
                <span>
                  <img
                    style={{
                      cursor: 'pointer',
                      /*marginLeft: 8,*/ width: 13,
                      height: 13,
                      marginBottom: 2,
                      transform: row.chartType === ChartType['2'] ? 'rotateY(180deg)' : undefined,
                    }}
                    src={IconChart[row.chartType]}
                    alt=""
                  />
                </span>
              ) : null}
              {indicatorNeedConfigMap[row.indexId] && listHeadParamMap[row.indexId]?.length ? (
                <Popover
                  placement="bottom"
                  content={<HoverTipContent hoverData={listHeadParamMap[row.indexId]} />}
                  trigger="hover"
                  mouseEnterDelay={0}
                  mouseLeaveDelay={0}
                >
                  <span>
                    <img
                      style={{
                        cursor: 'pointer',
                        // marginLeft: 6,
                        width: 12,
                        height: 12,
                        visibility: hoverRowKey === row.key ? 'visible' : 'hidden',
                      }}
                      src={TipSvg}
                      alt=""
                    />
                  </span>
                </Popover>
              ) : null}
            </span>
          );
        },
      },
    ];

    years?.forEach((o, i) => {
      /** 是否是预期目标列 */
      const isExpectCol = i === 0 && activeTab === 1;
      columns.push({
        title: <span>{isExpectCol ? o + '年经济预期目标' : o + (activeTab === 1 ? '年' : '')}</span>,
        width: 158,
        // className: i !== years?.length - 1 ? 'padding-10 align-right' : 'align-right',
        align: 'right',
        dataIndex: o,
        resizable: true,
        onCell: (record: any) => {
          const isUpdateItem = record?.paramDetailArr?.[o]?.updateValue;
          return !record?.[o]
            ? {}
            : handleTblCell({
                isUpdateItem,
                onClick: () => {},
                isMissVCA: record[`${o}_isMissVCA`] === '1',
                defaultClassName: i !== years?.length - 1 ? 'padding-10 align-right' : 'align-right',
              });
        },
        render: (text: any, row: any) => {
          if (row.specialTitle) return <></>;
          // const noTraceList = ['城投平台有息债务', '城投平台有息债务(本级)'];
          const isUpdateItem = row?.paramDetailArr?.[o]?.updateValue;
          const caliberDesc = row?.paramDetailArr?.[o]?.caliberDesc;
          // const { indicName: unUnitName, unit } = getIndicAndUnit(row?.paramName);
          // const isSpecial = specialIndicList.includes(unUnitName);
          const isNumber = isNaN(parseFloat(text)); //判断是否非数字，true非数字
          const res = !isNumber ? formatNumber(text) : text;
          return !res ? (
            <>-</>
          ) : row?.specialTitle ? (
            <></>
          ) : (
            <>
              {traceInfo.indexId === row.indexId && traceInfo?.paramMap?.auditYear?.[0] === `${o}` ? <Bg /> : null}
              <ListTableCell
                isShowTrace={traceSource}
                isShowUpdate={isUpdateItem}
                value={row[o]}
                extraProperties={{
                  ...row.extraProperties,
                  ...row?.paramDetailArr?.[o]?.extraProperties,
                  guId: row[o + 'guId'],
                }}
                onClick={(event: any) => {
                  handleCellClick(o, row, isUpdateItem, event);
                }}
              >
                {/* 区域深度资料-经济速览页面单元格内口径注释 */}
                {caliberDesc ? (
                  <CaliberNotes>
                    {/* 不加这个属性不会获取 guid，真服了这个设计，一坨，期待下个有缘人 */}
                    <div className="top" data-click-area={true}>
                      {row[o]}
                    </div>
                    <Popover
                      placement="bottomLeft"
                      content={caliberDesc}
                      arrowPointAtCenter={true}
                      overlayStyle={{
                        maxWidth: '208px',
                      }}
                    >
                      <span className="icon"></span>
                    </Popover>
                  </CaliberNotes>
                ) : (
                  row[o]
                )}
              </ListTableCell>
            </>
          );
        },
      });
    });
    return columns;
  }, [
    years,
    traceSource,
    handleShowModal,
    activeTab,
    onScreenChange,
    handleOpenMetric,
    hoverRowKey,
    handleCellClick,
    handleTblCell,
    indicatorNeedConfigMap,
    listHeadParamMap,
    traceInfo,
  ]);
}

function HoverTipContent({ hoverData }: { hoverData: { name: string; value: string }[] }) {
  const nameList: any[] = [],
    valueList: any[] = [],
    centerList: any[] = [];
  if (hoverData?.length) {
    hoverData.forEach((item) => {
      nameList.push(<div className="name-item">{item.name}</div>);
      valueList.push(<span className="value-item">{item.value}</span>);
      centerList.push(<span>:</span>);
    });
  }
  return (
    <ParamContent>
      <div className="name-box">{nameList}</div>
      <div className="center-box">{centerList}</div>
      <div className="value-box">{valueList}</div>
    </ParamContent>
  );
}

const Bg = styled.div`
  position: absolute;
  background: rgb(204, 238, 255);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const ParamContent = styled.div`
  font-size: 13px;
  width: 250px;
  display: flex;
  flex-direction: row;

  .name-box,
  .center-box,
  .value-box {
    display: inline-flex;
    width: max-content;
    flex-direction: column;
  }
  .name-item {
    text-align-last: justify;
    text-wrap: nowrap;
    // min-width: 50px;
  }
  .center-box {
    width: 6px;
  }
`;
// export const CaliberNotes = styled.span`
//   .top {
//     position: relative;
//     z-index: 1;
//   }
//   .icon {
//     position: absolute;
//     top: 8px;
//     right: 0;
//     width: 14px;
//     height: 14px;
//     background: url(${attention});
//   }
// `;
