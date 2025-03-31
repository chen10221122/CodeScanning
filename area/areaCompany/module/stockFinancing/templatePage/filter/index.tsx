import { useRef } from 'react';

import cn from 'classnames';
import dayJs, { Dayjs } from 'dayjs';
import { isEmpty } from 'lodash';

import { RangePicker } from '@/components/antd';
import { Screen } from '@/components/screen';

import { FilterEnum } from '../type';
import SortButton from './sortButton';
import styles from './style.module.less';

export default function Filter({ screenConfig, handleMenuChange, tabFilterCache }: any) {
  const containerRef = useRef(null);
  return (
    <div className={cn(styles.filterWrapper, 'filterWrap')} ref={containerRef}>
      {screenConfig.map((o: Record<string, any>, i: number) => {
        switch (o.type) {
          case FilterEnum.YearSort:
            return (
              <div key={i}>
                <SortButton
                  onChange={(v) => {
                    handleMenuChange(FilterEnum.YearSort, [v]);
                  }}
                />
              </div>
            );
          case FilterEnum.DateSort:
            return (
              <div key={i}>
                <SortButton
                  onChange={(v) => {
                    handleMenuChange(FilterEnum.DateSort, [v]);
                  }}
                />
              </div>
            );
          case FilterEnum.Year:
            return (
              <div key={i}>
                <span style={{ marginRight: 6 }}>年度</span>
                <RangePicker
                  getPopupContainer={() => containerRef.current || document.body}
                  keepValidValue={true}
                  size={'small'}
                  picker="year"
                  disabledDateStart={(date: Dayjs) => date.isBefore(dayJs('1990-01-01')) || date.isAfter(dayJs())}
                  disabledDateEnd={(date: Dayjs) => date.isBefore(dayJs('1990-01-01')) || date.isAfter(dayJs())}
                  value={
                    !isEmpty(tabFilterCache)
                      ? [dayJs(String(tabFilterCache.startYear)), dayJs(String(tabFilterCache.endYear))]
                      : undefined
                  }
                  /*defaultValue={
                    !isEmpty(tabFilterCache)
                      ? [dayJs(String(tabFilterCache.startYear)), dayJs(String(tabFilterCache.endYear))]
                      : undefined
                  }*/
                  placeholder={['开始年份', '结束年份']}
                  onChange={(range: [start: Dayjs, end: Dayjs] | any) => {
                    const value = range?.length
                      ? [dayJs(range[0]).format('YYYYMMDD'), dayJs(range[1]).format('YYYYMMDD')]
                      : '';
                    const dateObj = { value, key: 'date' };
                    handleMenuChange(FilterEnum.Year, [dateObj]);
                  }}
                />
              </div>
            );
          default:
            return (
              <div key={i} className={styles.itemWrapper}>
                {o.options[0]?.label ? <div className={styles.label}>{o.options[0].label}</div> : null}
                <div>
                  <Screen
                    // className={S.screenWrapper}
                    options={o.options}
                    onChange={(selectedData: Record<string, any>[], allData: Record<string, any>[]) => {
                      handleMenuChange?.(FilterEnum.EnterpriseNature, allData);
                    }}
                  />
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}
