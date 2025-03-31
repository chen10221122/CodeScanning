import { message } from 'antd';
import cn from 'classnames';
import { isNil, isNumber, round } from 'lodash';

import { IndicatorConfig, IndicatorResultType } from '@dataView/provider';

import { Options, ScreenType, RowItem } from '@/components/screen';
import { toFixed } from '@/utils/format';

import S from './styles.module.less';

/** 闪烁淡出耗时 */
export const FADE_DELAY = 500;
/** 闪烁用时 */
export const FLASH_DELAY = 300;

const YEAT = 'year';
const y = new Date().getFullYear();
/** 2013-至今的年份 */
export const getYears = (): RowItem[] => {
  const length = y - 2012;
  return Array.from({ length }).map((_, i) => {
    const year: string = String(y - i);
    return {
      name: year,
      value: year,
      key: YEAT,
    };
  });
};

export const YearConfig: Options[] = [
  {
    title: '时间选择',
    option: {
      type: ScreenType.SINGLE,
      children: getYears(),
      cancelable: false,
    },
    formatTitle: (selectedRows) => selectedRows[0]?.name + '年',
  },
];

/** 处理常用指标和其他指标，添加关联key */
export const formatIndicator = (
  defaultData: Record<string, any>[],
  list: Record<string, any>[],
  indicatorLen: Record<string, number>,
) => {
  list.forEach((item: Record<string, any>) => {
    if (item?.children?.length) {
      formatIndicator(defaultData, item.children, indicatorLen);
    } else {
      indicatorLen.len += 1;
      // 常用指标
      let associatedItem = defaultData.find((d: Record<string, any>) => d.indexId === item.indexId);
      item.key = item.indexId;
      item.hasVipIcon = item.needPrivilege === 1;

      if (associatedItem) {
        associatedItem.hasVipIcon = associatedItem.needPrivilege === 1;
        associatedItem.ignoreIndicator = true;
        // 常用指标添加关联key
        const keys = associatedItem?.associatedKey || [];
        associatedItem.associatedKey = [...keys, item.indexId];

        item.active = true;
        // 普通指标添加关联key
        item.associatedKey = [associatedItem.key];
      }
    }
  });
};

export const renderMessage = (text: string, hasCustom?: boolean) => {
  return message.warning({
    content: (
      <>
        <span className={cn({ text: hasCustom })}>{text}</span>
        {hasCustom ? (
          <a
            className="contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('sidebar-staff-service-btn')?.click();
            }}
            href="/#"
          >
            联系客服
          </a>
        ) : null}
      </>
    ),
    className: S.message,
    duration: hasCustom ? 5 : 3,
  });
};

// 千分位格式化
const formatThousandthsNumber = (value: number, fractionDigits = 2) =>
  toFixed(value, fractionDigits).replace(/(\d)(?=(\d{3})+(\.\d*)?$)/g, '$1,');

export const formatValue = (value: any, indicator: IndicatorConfig) => {
  let t: string, idx: number;

  if (isNil(value) || value === '') return '-';
  switch (indicator.resultType) {
    case IndicatorResultType.Money:
      return formatThousandthsNumber(value);
    case IndicatorResultType.IntNumberThousandthFormat:
      return formatThousandthsNumber(value, 0);
    case IndicatorResultType.NeedConvertNumber: {
      if (isNumber(value)) {
        const unit = indicator.unit || '';
        if ((value > 0 && value < 1e4) || value < 0) {
          return `${formatThousandthsNumber(value)}${unit}`;
        } else if (value >= 1e4 && value < 1e8) {
          return `${formatThousandthsNumber(parseFloat(toFixed(value / 1e4, 2)))}万${unit}`;
        } else {
          return `${formatThousandthsNumber(parseFloat(toFixed(value / 1e8, 2)))}亿${unit}`;
        }
      }
      return value;
    }
    case IndicatorResultType.Percent:
      t = round(value, 2).toString();
      idx = t.indexOf('.');

      if (idx === -1) {
        t += '.00';
      } else if (t.length - idx - 1 !== 2) {
        t += '0';
      }

      return `${t}%`;
    default:
      return value;
  }
};
