import { CSSProperties, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMemoizedFn } from 'ahooks';
import { isEmpty, isFunction } from 'lodash';

import { Radio } from '@/components/antd';
import Dropdown from '@/components/screen/components/dropdown';
import useChange from '@/components/screen/hooks/useChange';
import useDefault from '@/components/screen/hooks/useDefault';
import useTitle from '@/components/screen/hooks/useTitle';
import useVisible from '@/components/screen/hooks/useVisible';
import { DefaultMultipleValues, isCalendarLine, RowItem } from '@/components/screen/items/types';

import Overlay, { OverlayProps } from './overlay';

interface MultipleTilingProps {
  index: number;
  data: OverlayProps['data'];
  title: string;
  onChange?: (selectedItems: RowItem[] | undefined, index: number) => void;
  defaultValue?: DefaultMultipleValues;
  formatTitle?: (rows: RowItem[]) => string;
  ellipsis?: number;
  textEllipsis?: number;
  overlayClassName?: string;
  overlayStyle?: CSSProperties;
  radioGroupStyle?: CSSProperties;
  defaultRelation?: { value: DefaultMultipleValues; name: string; selected?: boolean }[];
  getPopContainer?: (triggerNode: HTMLElement) => HTMLElement;
}

function MultipleTiling({
  data,
  title,
  onChange,
  defaultValue,
  index,
  formatTitle,
  ellipsis,
  textEllipsis,
  overlayClassName,
  overlayStyle,
  defaultRelation,
  radioGroupStyle,
  getPopContainer,
}: MultipleTilingProps) {
  const { visible, hide, changeVisible } = useVisible();
  const { showTitle, setTitle } = useTitle(title, ellipsis);
  const isChangeDefaultRef = useRef(false);

  const allData = useMemo(() => {
    return data.reduce((result, row) => {
      if (!isCalendarLine(row)) {
        return [...result, ...row.data];
      }
      return result;
    }, [] as RowItem[]);
  }, [data]);

  const [defaultArr, setDefaultArr] = useState(defaultValue);

  const defaultSelected = useDefault(allData, defaultArr);

  const handleOuterChange = useMemoizedFn((selected?: RowItem[]) => {
    if (!isChangeDefaultRef.current) onChange?.(selected, index);

    if (formatTitle && isFunction(formatTitle)) {
      !selected || isEmpty(selected) ? setTitle(title) : setTitle(formatTitle(selected));
    }
  });

  const { isDirty, handleChange } = useChange({ defaultValue: defaultSelected, onChange: handleOuterChange });

  const [radioVal, setRadioVal] = useState(() => {
    let result = 0;

    if (defaultRelation) {
      let idx = defaultRelation.findIndex((o) => o.selected);
      if (idx !== -1) result = idx;
    }
    return result;
  });

  const onRadioChange = useCallback(
    (e) => {
      isChangeDefaultRef.current = true;
      setRadioVal(e.target.value);

      requestAnimationFrame(() => {
        isChangeDefaultRef.current = false;
      });
    },
    [setRadioVal],
  );

  useEffect(() => {
    defaultRelation && setDefaultArr(defaultRelation[radioVal].value);
  }, [radioVal, setDefaultArr, defaultRelation]);

  return (
    <Dropdown
      title={showTitle}
      visible={visible}
      dirty={isDirty}
      overlay={() => (
        <>
          {defaultRelation ? (
            <div style={radioGroupStyle}>
              <Radio.Group onChange={onRadioChange} value={radioVal}>
                {defaultRelation.map((o, i) => (
                  <Radio value={i} key={o.name}>
                    {o.name}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          ) : null}

          <Overlay
            onConfirm={hide}
            data={data}
            onChange={handleChange}
            defaultValue={defaultSelected}
            onTitleChange={setTitle}
            ellipsis={textEllipsis}
          />
        </>
      )}
      onVisibleChange={changeVisible}
      overlayClassName={overlayClassName}
      overlayStyle={overlayStyle}
      getPopupContainer={getPopContainer}
    />
  );
}

export default memo(MultipleTiling);
