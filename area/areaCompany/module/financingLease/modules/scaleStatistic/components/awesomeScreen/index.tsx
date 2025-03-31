import { useRef, FC, useState } from 'react';

import cn from 'classnames';
import { Dayjs } from 'dayjs';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { DatePicker, RangePicker } from '@/components/antd';
import ExportDoc from '@/components/exportDoc';
import { Screen, ScreenType } from '@/components/screen';
import ScreenForm, { Group, Item } from '@/components/screenForm';
import { useMount } from '@/utils/hooks';

export interface IExportInfoType {
  moduleType: string;
  fileName: string;
  exportState?: boolean;
  exportParams?: { [value: string]: any } /* 不同的页面的额外参数 */;
  exportCondition?: { [value: string]: any };
}

export interface TConf {
  /** 筛选是否改变 */
  changeFlag: boolean;
  /** 是否显示label，如果两个筛选在一起，只显示一个label，那么第二个筛选的label不填 */
  label?: string;
  /** 对应字段的key/name */
  key: string;
  /** 微调筛选项样式 */
  style: React.CSSProperties;
  /** 该筛选项的配置，完全兼容screen */
  itemConf: any;
  /** 受控数据，配置同screen的受控 */
  values?: any[];
  /** ^_^ */
  initValues?: any[];

  type?: string;
}

export const AwesomeScreen: FC<{
  exportInfo: IExportInfoType | any;
  onChange: (v: any) => void;
  onRangeChange?: (dates: null | (Dayjs | null)[], dateStrings: string[]) => void;
  onDateTypeChange?: (value: any) => void;
  conf: TConf[];
}> = ({ conf, exportInfo, onChange, onRangeChange, onDateTypeChange }) => {
  const screen1Ref = useRef<any>();

  const [watchSizeChange, setWatchSizeChange] = useState(false);
  const timeOutRef = useRef<NodeJS.Timeout>();
  useMount(() => {
    timeOutRef.current = setTimeout(() => setWatchSizeChange(true), 200);
    return () => timeOutRef.current && clearInterval(timeOutRef.current);
  });

  const [type, setType] = useState<'month' | 'year' | 'quarter'>('quarter');

  return (
    <div ref={screen1Ref}>
      {/* 筛选操作 */}
      {conf && !isEmpty(conf) && (
        <Container>
          <ScreenWrapper>
            <ScreenForm style={{ paddingLeft: 0 }}>
              <Group watchSizeChange={watchSizeChange} style={{ overflow: 'visible' }}>
                {conf.map((i, idx) => {
                  if (i?.type === 'date') {
                    return (
                      <Item label={i?.label} name={i?.key} style={i?.style} className={''} key={idx}>
                        {/* <div> */}
                        <RangePicker
                          size="small"
                          keepValidValue
                          onChange={onRangeChange}
                          getPopupContainer={() => (screen1Ref.current as HTMLElement) || document.body}
                        />
                        {/* </div> */}
                      </Item>
                    );
                  } else if (i?.type === 'dateType') {
                    return (
                      <>
                        <Item label={i?.label} name={i?.key} style={i?.style} className={''} key={idx}>
                          <Screen
                            options={[
                              {
                                title: '统计周期',
                                option: {
                                  type: ScreenType.SINGLE,
                                  ellipsis: 5,
                                  children: [
                                    { key: '年', value: 'year', name: '年' },
                                    { key: '月', value: 'month', name: '月' },
                                    { key: '季', value: 'quarter', name: '季' },
                                  ],
                                },
                              },
                            ]}
                            values={[[type]]}
                            onChange={(v) => {
                              setType(v?.[0]?.value);
                            }}
                            getPopContainer={() => (screen1Ref.current as HTMLElement) || document.body}
                          />
                        </Item>
                        <Item name={''} style={i?.style} className={'form-item'} key={idx + 'x'}>
                          <DatePicker
                            picker={type}
                            size="small"
                            onChange={onDateTypeChange}
                            placeholder="自定义"
                            getPopupContainer={() => screen1Ref.current}
                          />
                        </Item>
                      </>
                    );
                  } else {
                    return (
                      <Item
                        label={i?.label}
                        name={i.key}
                        key={idx}
                        style={i?.style}
                        className={cn(
                          'form-item',
                          `${i?.changeFlag ? 'full-screen-form-item-changed' : 'full-screen-form-item-unchanged'}`,
                        )}
                      >
                        <Screen
                          options={[i?.itemConf]}
                          values={i?.values ? [i.values] : undefined}
                          initValues={i?.initValues ? [i.initValues] : undefined}
                          onChange={onChange}
                          getPopContainer={() => screen1Ref.current}
                        />
                      </Item>
                    );
                  }
                })}
              </Group>
            </ScreenForm>
          </ScreenWrapper>
          <Operating style={{ alignItems: 'baseline' }}>
            <ExportDoc
              condition={{ ...exportInfo?.exportCondition }}
              filename={exportInfo?.fileName}
              disabled={exportInfo?.exportState}
              style={{ height: 25, fontSize: 13, fontWeight: 400 }}
            />
          </Operating>
        </Container>
      )}
    </div>
  );
};

const ScreenWrapper = styled.div`
  width: 88%;
  padding-left: 9px;
  > div {
    width: 100%;
  }
`;

export const Operating = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  white-space: nowrap;
  .count {
    font-size: 13px;
    color: #8c8c8c;
    margin-right: 6px;
    span {
      color: #494949;
      padding: 0 4px;
    }
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .no-border {
    margin-right: 16px;
    > div {
      background: #fff !important;
      border: none !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }
  }
  .form-item {
    margin-right: 16px;
  }
  .full-screen-form-item-unchanged {
    .screen-component {
      background: #ffffff;
      .ant-dropdown-trigger {
        > span {
          i {
            background-image: url(${require('@/components/screen/images/icon_arrow.svg')}) !important;
          }
        }
      }
    }
  }
  .full-screen-form-item-changed {
    .screen-component {
      background: #f5faff;
      .ant-dropdown-trigger {
        > span {
          i {
            background-image: url(${require('@/components/screen/images/icon_arrowActive.svg')}) !important;
          }
        }
      }
    }
  }
`;
