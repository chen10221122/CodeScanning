import { useState } from 'react';

import dayJs, { Dayjs } from 'dayjs';

import AreaForm from '@pages/area/areaFinancing/components/commonTemplate/areaForm';
import { CustomScreenType } from '@pages/area/areaFinancing/hooks/useCommonScreen';

import { Checkbox, RangePicker } from '@/components/antd';
import { Screen } from '@/components/screen';

import S from './style.module.less';

export default function Filter({ screenConfig, handleMenuChange, extraMenu }: any) {
  // 用于联动
  const [dateValue, setDateValue] = useState<[start: Dayjs, end: Dayjs] | any>([null, null]);
  const [checked, setChecked] = useState(true);
  return (
    <div className={S.filterWrapper}>
      {screenConfig.map((o: any, i: number) => {
        if (o.type === CustomScreenType.AreaGroup) {
          return <AreaForm key={i} areaData={o} onChange={handleMenuChange} />;
        }
        return <Screen key={i} options={[o]} onChange={handleMenuChange} />;
      })}

      {extraMenu ? (
        <div className={S.extra}>
          <div className={S.item}>
            <span>
              区间：
              <RangePicker
                size={'small'}
                value={dateValue}
                onChange={(range: [start: Dayjs, end: Dayjs] | any) => {
                  const value = range?.length
                    ? `[${dayJs(range[0]).format('YYYYMMDD')},${dayJs(range[1]).format('YYYYMMDD')}]`
                    : '';
                  const dateObj = { value, key: 'date' };
                  setDateValue(range);
                  setChecked(!range);
                  handleMenuChange([dateObj], [dateObj]);
                }}
              />
            </span>
          </div>
          <div className={S.item}>
            <Checkbox
              className={S.checkboxWrapper}
              defaultChecked={true}
              checked={checked}
              onChange={(e) => {
                const dateObj = { value: e.target.checked ? '' : [], key: 'date' };
                handleMenuChange([dateObj], [dateObj]);
                setChecked(e.target.checked);
                if (e.target.checked) setDateValue([null, null]);
              }}
            >
              历史累计
            </Checkbox>
          </div>
        </div>
      ) : null}
    </div>
  );
}
