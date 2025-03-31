import className from 'classnames';

import Overview from './../../components/overview';
import ToAreaCompare from './ToAreaCompare';
import { AreaShareParams, RegionData, RenderableIndicator } from './utils';

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
    const item = row[key];
    // 当 item 为 RegionData 时，
    if (item && typeof item !== 'string') {
      areas.codes.push(item.code + '');
      areas.areas.push(item.name);
      areas.year = item.year;
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

interface params {
  beforeLeave: () => Boolean;
}

const columns = function ({ beforeLeave }: params) {
  // 指标列
  let cols: Colums = [
    {
      title: '指标',
      align: 'left',
      dataIndex: 'title',
      width: '188px',
      className: 'similar-title similar-title-padding',
      render: (text: string) => {
        return <span>{text}</span>;
      },
    },
    // 本地数据列
    {
      title: '指标',
      align: 'left',
      dataIndex: 'region0',
      width: '148px',
      className: 'similar-region-cell-padding',
      render: (region: RegionData, row: any) => {
        // 本地图标
        // console.log('region', region);
        const localTag = <span className="icon-region"></span>;
        let dataBlock = null;
        if (region) {
          const areasStr = region.name, // 地区名
            dataBlockClassName = className(
              'region-name',
              'similar-local',
              'similar-local-ellipsis',
              'similar-local-center',
            );
          dataBlock = (
            <>
              <div className={dataBlockClassName}>
                {/* {areasStr.length > 8 ? (
                  <Popover
                    getPopupContainer={() => document.querySelector('#similarContainer') as HTMLDivElement}
                    overlayClassName="similar-economy-popover"
                    placement="topLeft"
                    color="rgba(0, 0, 0, 0.75)"
                    content={areasStr}
                    trigger="hover"
                  >
                    <div className="name overflow-ellipsis long">{areasStr.slice(0, 8) + '...'}</div>
                  </Popover>
                ) : (
                  <span className="name overflow-ellipsis long">{areasStr}</span>
                )} */}
                {/* <Overview text={areasStr} containerId="similarContainer" placement="topLeft" />、 */}
                <div className="region-value">{areasStr}</div>
                {localTag}
              </div>
              <div className="region-value">{region.value}</div>
            </>
          );
        } else {
          dataBlock = <div className="region-name">-{localTag}</div>;
        }
        // 渲染
        return <span className="similar-more-wrap">{dataBlock}</span>;
      },
    },
  ];
  // 核心数据列
  for (let i = 1; i < MAX_COLS_INDEX; i++) {
    cols.push({
      ellipsis: true,
      width: '148px',
      align: 'center',
      className: className('similar-region-cell-padding'),
      dataIndex: 'region' + i,
      render: (region: RegionData, row: any) => {
        // 本地图标
        const localTag = !i ? <span className="icon-region"></span> : null;
        let dataBlock = null;
        if (region) {
          const areasStr = region.name;

          dataBlock = (
            <>
              <div className={'region-name'}>
                {/* {areasStr.length > 8 ? (
                  <Popover
                    arrowPointAtCenter={true}
                    getPopupContainer={() => document.querySelector('#similarContainer') as HTMLDivElement}
                    overlayClassName="similar-economy-popover"
                    color="rgba(0, 0, 0, 0.75)"
                    placement="top"
                    content={areasStr}
                    trigger="hover"
                  >
                    <div className="name overflow-ellipsis w100">{areasStr.slice(0, 9) + '...'}</div>
                  </Popover>
                ) : (
                  null
                )}
                <div>
                  <span className="name overflow-ellipsis w100">{areasStr}</span>
                </div> */}

                <Overview text={areasStr} containerId="similarContainer" placement="top" />
                {localTag}
              </div>
              <div className="region-value">{region.value}</div>
            </>
          );
        } else {
          dataBlock = <div className="region-name">-{localTag}</div>;
        }
        // 渲染
        return <span className="similar-more-wrap">{dataBlock}</span>;
      },
    });
  }
  // 转跳列
  cols.push({
    title: '指标',
    align: 'center',
    dataIndex: '',
    width: '70px',
    className: 'similar-title similar-title-padding similar-region-share',
    render: (region: RegionData, row: any) => {
      return <ToAreaCompare beforeLeave={beforeLeave} query={buildCompareLink(getAreasFromRow(row))} />;
    },
  });
  return cols;
};

export default columns;
