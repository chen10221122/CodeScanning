/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, memo, useRef, useState, useMemo, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';

import { Checkbox, Popover } from '@dzh/components';
import { useImmer } from '@dzh/hooks';
import Screen from '@dzh/screen';
import { useMemoizedFn, useRequest } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { getsimilarAreaInitYear } from '@/apis/area/areaEconomy';
import NoPayDialog from '@/app/components/dialog/power/noPayCreatLimit';
import { baseColor } from '@/assets/styles';
import { Icon } from '@/components';
import ExportDoc from '@/components/exportDoc';

import { useCtx } from '../../context';
import { IFilterProps, EFlag } from '../../utils';
import MetricModal from '../metricModal';
import { defaultIndicators } from './indicator';
import useMenuConfig from './menuConfig';
const iconStyle = { width: 12, height: 12, marginLeft: '4px', lineHeight: '20px', marginTop: '2px' };

export interface ForwardObject {
  /** 重置筛选项 */
  resetFilters: () => void;
  openIndictorModal: () => void;
}

const Filters = forwardRef<ForwardObject>((_, ref) => {
  const domRef = useRef<HTMLDivElement>(null);
  const {
    state: { params, hasPay, resetIndicators },
    update,
  } = useCtx();
  const [modalVisible, setModalVisible] = useState(false);
  const [filterParams, setFilterParams] = useImmer<IFilterProps>(params);
  const [noPayDialogVisible, setNoPayDialogVisible] = useState(false);
  const [screenKey, setScreenKey] = useState(0); // 年份screenkey
  const [deviationKey, setDeviationKey] = useState(1); // 年份screenkey

  const {
    data: initYear,
    loading,
    run: getYear,
  } = useRequest(() => getsimilarAreaInitYear(params?.code), {
    manual: true,
    onFinally() {
      update((d) => {
        d.yearLoading = false;
      });
    },
  });
  const { yearMenu, deviationMenu } = useMenuConfig(initYear?.data);

  useMemo(() => {
    params.code && getYear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.code]);

  /**年份 筛选项变动 */
  const menuChanged = useMemoizedFn((currentSelected, _allSelected, _index) => {
    setFilterParams((draft) => {
      draft.year = currentSelected[0]?.value;
    });
  });

  // 偏离度
  const changeMenuDeviation = useMemoizedFn((currentSelected, _allSelected, _index) => {
    if (currentSelected.length > 0 && currentSelected[0].value) {
      setFilterParams((draft) => {
        draft.deviationRange =
          currentSelected[0]?.name === '自定义'
            ? '[' + currentSelected[0]?.value?.join(',') + ']'
            : currentSelected[0]?.value;
      });
      update((d) => {
        d.rangeDisplayText =
          currentSelected[0]?.name === '自定义'
            ? `${currentSelected[0]?.value[0]}%~${currentSelected[0]?.value[1]}%`
            : `${currentSelected[0]?.name}`;
      });
    } else {
      setDeviationKey(Math.random());
    }
  });

  const changeSameRegionLevel = useMemoizedFn((type: keyof IFilterProps, value: boolean) => {
    setFilterParams((d) => {
      d.sameRegionLevel = value ? EFlag.TRUE : EFlag.FALSE;
    });
  });

  const changeOnlyProvince = useMemoizedFn((type: keyof IFilterProps, value: boolean) => {
    setFilterParams((d) => {
      d.onlyProvince = value ? EFlag.TRUE : EFlag.FALSE;
    });
  });

  // 初始化年份默认值
  useEffect(() => {
    setFilterParams((d) => {
      d.year = initYear?.data;
    });
  }, [initYear, setFilterParams]);

  // 参数变动
  useEffect(() => {
    update((draft) => {
      draft.params = { ...filterParams, code: params.code };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterParams, params.code, update]);

  // 打开指标弹窗
  const openIndictorModal = useMemoizedFn(() => {
    hasPay ? setModalVisible(true) : setNoPayDialogVisible(true);
  });

  // 指标筛选修改参数
  const handleConfirmChange = useMemoizedFn((checkedNodes) => {
    setFilterParams((d) => {
      d.indicName = checkedNodes.map((i: { value: any }) => i.value).join(',');
    });
  });

  useImperativeHandle(ref, () => ({
    resetFilters: () => {
      setScreenKey(Math.random());
      setDeviationKey(Math.random());
      resetIndicators();
      setFilterParams((d) => {
        d.year = initYear?.data;
        d.deviationRange = '[0,5]';
        d.sameRegionLevel = EFlag.FALSE;
        d.onlyProvince = EFlag.FALSE;
        d.indicName = defaultIndicators;
      });
      update((d) => {
        d.isFilterChanged = false;
      });
    },
    openIndictorModal,
  }));

  return (
    <Filter ref={domRef}>
      <div className="left-part">
        {loading ? null : (
          <Screen
            key={screenKey}
            options={yearMenu}
            onChange={menuChanged}
            getPopContainer={() => domRef.current || document.body}
          />
        )}
        <Screen
          key={deviationKey}
          options={deviationMenu}
          onChange={changeMenuDeviation}
          getPopContainer={() => domRef.current || document.body}
        />
        <Popover
          placement="bottom"
          trigger="hover"
          content={<div>偏离度=(对比地区-本地区)*100%/本地区</div>}
          getPopupContainer={() => document.getElementById('similarContainer') || document.body}
        >
          <span className={'tipImg'}>
            <Icon size={12} unicode="&#xe704;" />
          </span>
        </Popover>
        <Checkbox
          checked={!!filterParams.sameRegionLevel}
          className="sameRegionLevel"
          onChange={(e) => changeSameRegionLevel('sameRegionLevel', e.target.checked)}
        >
          同行政级别
        </Checkbox>
        <Checkbox
          checked={!!filterParams.onlyProvince}
          className="onlyProvince"
          onChange={(e) => changeOnlyProvince('onlyProvince', e.target.checked)}
        >
          只看省内
        </Checkbox>
      </div>
      <div className="right-part">
        {/* <div className="indicatorWrap" onClick={openIndictorModal}>
          <Icon className="edit" image={require('@/assets/images/area/edit.png')} />
          <span>自定义指标</span>
          <Icon style={iconStyle} image={require('@/assets/images/power/vip.png')} />
        </div> */}
        <ExportDoc
          condition={{
            ...params,
            regionCode: params?.code,
            module_type: 'similiar_economic_new',
          }}
          filename={`相似经济${dayjs(new Date()).format('YYYYMMDD')}`}
        />
      </div>
      <MetricModal
        onConfirmChange={handleConfirmChange}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
      />
      <NoPayDialog
        visible={noPayDialogVisible}
        setVisible={(v: boolean) => setNoPayDialogVisible(v)}
        type
        customMsgTxt="此功能为VIP专属功能，开通VIP版即可使用"
        zIndex={1200}
      />
    </Filter>
  );
});

export default memo(Filters);

const Filter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0px;
  position: sticky;
  z-index: 5;
  top: 0px;
  background-color: #fff;
  width: 100%;
  height: 36px;
  .left-part {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .sameRegionLevel {
      margin-left: 5px;
    }
    .onlyProvince {
      margin-left: 24px;
    }
    .ant-checkbox-wrapper {
      padding-bottom: 2px;
    }
    .ant-checkbox {
      top: 0.15em;
    }
  }
  .screen-wrapper {
    float: left;
    margin-right: 24px;
    position: relative;
  }

  .tipImg {
    position: relative;
    top: -2px;
    left: -18px;
    cursor: pointer;
    color: #d9d9d9;

    &:hover {
      color: ${baseColor.primary};
    }
  }
  .right-part {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .indicatorWrap {
      cursor: pointer;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-right: 24px;
      height: 20px;
      .edit {
        width: 12px;
        height: 12px;
        margin-right: 4px;
      }
      span {
        line-height: 20px;
      }
    }
  }
`;
