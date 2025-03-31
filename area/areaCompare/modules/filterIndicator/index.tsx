import React, { memo, FC, useRef } from 'react';

import { Anchor, Checkbox } from 'antd';
import dayjs from 'dayjs';

import { Tooltip } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { Screen } from '@/components/screen';
import { TransferSelect } from '@/components/transferSelectNew';
import { YearConfig } from '@/pages/area/areaCompare/const';
import { useCtx } from '@/pages/area/areaCompare/context';

import useFilterInfo from '../../hooks/useFilterInfo';

const { Link } = Anchor;
interface IProps {
  condition: Record<string, string>;
  selectYear: string;
  setSelectYear: React.Dispatch<React.SetStateAction<string>>;
  // openSource: boolean;
  // setOpenSource: (e: boolean) => void;
  traceCref: JSX.Element;
}

const FilterIndicator: FC<IProps> = (props) => {
  const {
    state: { indexIds },
  } = useCtx();
  const { condition, selectYear, setSelectYear, traceCref } = props;

  const domRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const { handleYearChanged, anchorTitles, indicatorList, handleIndicChange, checked, handleCheckChange, hasIndexIds } =
    useFilterInfo(setSelectYear);
  // console.log(hasIndexIds.current, 'indexIds==', indexIds, indicatorList,);

  return (
    <div className="filter-indicator" ref={domRef}>
      <div className="filter-export">
        <div className="filter-wrap" ref={filterRef}>
          <Screen
            values={[[selectYear]]}
            options={YearConfig}
            onChange={handleYearChanged}
            getPopContainer={() => domRef.current || document.body}
          />
          {hasIndexIds.current && indicatorList.length ? (
            <TransferSelect // check
              title="指标"
              data={indicatorList}
              checkMaxLimit={false}
              values={hasIndexIds.current ? indexIds : undefined}
              moduleCode="dqdbgj"
              forbidEmptyCheck
              hideSaveTemplate
              pageCode=""
              onChange={handleIndicChange}
              getPopupContainer={() => domRef.current || document.body}
            />
          ) : null}
          <div className="check-wrap">
            <Checkbox checked={checked} onChange={handleCheckChange}>
              <span className="text">记住指标</span>
            </Checkbox>
            <Tooltip
              color="#fff"
              // trigger={'click'}
              getPopupContainer={() => filterRef.current || document.body}
              title={() => <div className="remark-pop">记住指标开启后，会保留最后一次的筛选指标</div>}
            >
              <img className="update-help-img" src={require('@/assets/images/common/help.png')} alt="" />
            </Tooltip>
          </div>
        </div>

        <div className="export-wrap">
          {/* 溯源 */}
          {traceCref}
          <ExportDoc
            condition={{ ...condition, module_type: 'web_area_compare', exportFlag: true }}
            filename={`地区比较${dayjs(new Date()).format('YYYYMMDD')}`}
          />
        </div>
      </div>
      <div className="indicators">
        <Anchor
          offsetTop={152}
          getContainer={() => (document.getElementById('tabsWrapper') as HTMLElement) || document.body}
        >
          {anchorTitles.map((d: string, i: number) => (
            <Link key={d + i} href={`#${d}`} title={d} />
          ))}
        </Anchor>
      </div>
    </div>
  );
};

export default memo(FilterIndicator);
