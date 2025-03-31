import { FC, memo, useState, useMemo } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { difference } from 'lodash';
import styled from 'styled-components';

import { Modal } from '@/components/antd';
import { useCtx } from '@/pages/area/areaCompareAdvance/context';
import useRecord from '@/pages/area/areaCompareAdvance/hooks/useRecord';

import CheckboxGroup from '../checkboxGroup';

const CompareRecord: FC<{ visible: boolean; onCancel: () => void; onSelect: (d: any) => void }> = ({
  visible,
  onCancel,
  onSelect,
}) => {
  const { compareHistoryData } = useRecord();

  const {
    state: { areaSelectCode },
  } = useCtx();

  const [checkedList, setCheckedList] = useState<(string | number)[]>(areaSelectCode?.match(/[^,]+/g) ?? []);

  const options = useMemo(() => {
    if (compareHistoryData?.length) {
      return compareHistoryData.map((o: { regionName: string; regionCode: string }) => ({
        label: o.regionName,
        value: o.regionCode,
        defaultChecked: areaSelectCode?.match(/[^,]+/g)?.includes(o.regionCode),
      }));
    }
  }, [areaSelectCode, compareHistoryData]);

  const distinctCodeList = useMemo(
    () => difference(checkedList, areaSelectCode?.match(/[^,]+/g) ?? []),
    [areaSelectCode, checkedList],
  );

  const onChange = useMemoizedFn((list) => {
    setCheckedList(list);
  });

  return (
    <ModalWithStyle
      title="对比历史"
      visible={visible}
      footer={null}
      destroyOnClose
      onCancel={onCancel}
      width={680}
      bodyStyle={{ padding: '14px 6px 20px 24px' }}
      centered
      type="titleWidthBgAndMaskScroll"
      contentId=""
    >
      <div className="area-modal-box">
        <CheckboxGroup options={options || []} value={checkedList} onChange={onChange} />
      </div>

      <div className="modal-btn">
        <div className="cancel" onClick={onCancel}>
          取消
        </div>
        <div
          className={cn('nocompare', { compare: !!distinctCodeList?.length })}
          onClick={() => {
            distinctCodeList?.length && onSelect?.(checkedList);
          }}
        >
          去对比
        </div>
      </div>
    </ModalWithStyle>
  );
};
export default memo(CompareRecord);
const ModalWithStyle = styled(Modal)`
  .ant-modal-body {
    padding: 6px 6px 20px 24px !important;
  }
  .area-modal-box {
    min-height: 208px;
  }

  .compare-record-table {
    max-height: 380px;
    min-height: 106px;
    overflow: auto;
    padding: 0 25px;
    overflow: overlay;
    &::-webkit-scrollbar {
      width: 10px;
    }
    &::-webkit-scrollbar-thumb {
      //background-clip: initial;
    }
    .content-list {
      display: flex;
      align-items: center;
      > div {
        width: 86px;
        padding: 0 8px;
        text-align: center;
      }
    }
    .ellipsis-area {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .compare-btn {
    width: 48px;
    height: 22px;
    background: #0171f614;
    border-radius: 2px;
    font-size: 13px;
    font-weight: 400;
    display: flex;
    color: #025cdc;
    align-items: center;
    margin: 0 auto;
    justify-content: center;
    cursor: pointer;
  }

  .modal-btn {
    display: flex;
    justify-content: end;
    div {
      width: 90px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      font-size: 15px;
      font-weight: 500;
      color: #0171f6;
      border: 1px solid #eaebec;
      border-radius: 2px;
      cursor: pointer;
      &:nth-of-type(1) {
        margin-right: 12px;
      }
    }

    .nocompare {
      background: #e6e6e6;
      border: none;
      color: #ffffff;
      margin-right: 14px;
      cursor: unset;
    }

    .compare {
      background: #0171f6;
      border: none;
      color: #ffffff;
      cursor: pointer;
    }
  }
`;
