import { memo, ReactNode, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { isFunction } from 'lodash';

import CalendarLine from '@/components/screen/items/multipleTiling/calendarLine';
import MultipleTilingLine, { ForwardObject } from '@/components/screen/items/multipleTiling/multipleTilingLine';
import { CalendarLineRow, isCalendarLine, MultipleTilingLineRow, RowItem } from '@/components/screen/items/types';
import { useImmer, useMountedState } from '@/utils/hooks';

import styles from './styles.module.less';
import useGroup from './useGroup';

import commonStyles from '@/components/screen/styles.module.less';

export interface OverlayProps {
  onConfirm?: () => void;
  onChange?: (selected: RowItem[]) => void;
  data: (MultipleTilingLineRow | CalendarLineRow)[];
  defaultValue?: RowItem[];
  ellipsis?: number;
  onTitleChange?: (title: ReactNode) => void;
}

function Overlay({ onConfirm, onChange, data, defaultValue, onTitleChange, ellipsis }: OverlayProps) {
  const [key, setKey] = useState(Date.now());
  const isMounted = useMountedState();
  const wrapper = useRef<HTMLDivElement>(null);
  const lineRef = useRef<ForwardObject[]>([]);
  const [selected, setSelected] = useImmer<RowItem[][]>([]);
  const totalSelected = useMemo(() => selected.reduce((total, row) => [...total, ...row], []), [selected]);

  const handleConfirm = () => {
    lineRef.current.forEach((ref) => {
      ref.confirm();
    });
    onConfirm?.();
  };

  useLayoutEffect(() => {
    if (defaultValue) {
      setKey(Date.now());
    }
  }, [defaultValue, setKey]);

  useLayoutEffect(() => {
    if (isMounted()) {
      onChange?.(totalSelected);
    }
  }, [isMounted, onChange, totalSelected]);

  const handleMultipleTilingLineChange = (selected: RowItem[], index: number, row: MultipleTilingLineRow) => {
    setSelected((draft) => {
      draft[index] = selected;
    });
    if (row.formatTitle && isFunction(row.formatTitle)) {
      // @ts-ignore
      onTitleChange?.(row.formatTitle(selected));
    }
  };

  const handleCalendarLineChange = (selected: RowItem | undefined, index: number) => {
    if (selected) {
      setSelected((draft) => {
        draft[index] = [selected];
      });
    } else {
      setSelected((draft) => {
        draft[index] = [];
      });
    }
  };

  const { group, groupIndex, handleSelectChange } = useGroup();

  return (
    <div ref={wrapper}>
      <div className={styles.wrapper} key={key}>
        {data.map((row, index) => {
          if (isCalendarLine(row)) {
            return (
              <CalendarLine
                key={index}
                index={index}
                groupIndex={groupIndex}
                currentGroup={group}
                group={row.group}
                onSelectChange={handleSelectChange}
                onChange={(selected) => handleCalendarLineChange(selected, index)}
                ref={(r) => {
                  if (r) {
                    lineRef.current[index] = r;
                  }
                }}
                wrapper={wrapper}
                title={row.title}
              />
            );
          }
          return (
            <MultipleTilingLine
              ref={(r) => {
                if (r) {
                  lineRef.current[index] = r;
                }
              }}
              index={index}
              groupIndex={groupIndex}
              currentGroup={group}
              group={row.group}
              onSelectChange={handleSelectChange}
              wrapper={wrapper}
              onChange={(selected) => handleMultipleTilingLineChange(selected, index, row)}
              key={index}
              title={row.title}
              hasSelectAll={row.hasSelectAll}
              multiple={row.multiple}
              data={row.data}
              cancelable={row.cancelable}
              defaultValue={defaultValue}
              ellipsis={ellipsis}
            />
          );
        })}
      </div>
      <div className={commonStyles.bottomGroupWrapper}>
        <span
          className={commonStyles.reset}
          onClick={() => {
            setKey(Date.now());
          }}
        >
          <i className="iconfont iconzhongzhi" />
          重置
        </span>
        <span className={commonStyles.confirm} onClick={handleConfirm}>
          确定
        </span>
      </div>
    </div>
  );
}

export default memo(Overlay);
