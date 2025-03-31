import { useRef, useState } from 'react';

import { useMount } from 'ahooks';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import { Checkbox } from '@/components/antd';
import RangePicker from '@/components/antd/rangePicker';
import ExportDoc from '@/components/exportDoc';
import { Screen } from '@/components/screen';
import ScreenForm, { Group, Item } from '@/components/screenForm';
import TopicSearch from '@/components/topicSearch';
import { formatNumber } from '@/utils/format';

import { FilterProps } from '../config';
import S from './style.module.less';

export default function Filter({
  options,
  picker,
  screenChange,
  total = 0,
  date,
  dateChange,
  condition,
  filename,
  keywordRef,
  handleSearch,
  dataKey,
  reFresh,
  handleCheck,
  usePost,
  screenRef,
  withoutSearch,
}: FilterProps) {
  const [watchSizeChange, setWatchSizeChange] = useState(false);
  const timeOutRef = useRef<NodeJS.Timeout>();

  useMount(() => {
    timeOutRef.current = setTimeout(() => setWatchSizeChange(true), 200);
    return () => timeOutRef.current && clearInterval(timeOutRef.current);
  });
  return (
    <Container ref={screenRef}>
      <ScreenWrapper style={{ width: withoutSearch ? '80%' : '55%' }}>
        <ScreenForm style={{ paddingLeft: 0 }} key={reFresh}>
          <Group watchSizeChange={watchSizeChange} style={{ overflow: 'visible' }} className={S.filterGroup}>
            {options?.map((opt: any, idx: number) => {
              if (opt?.type === 'rangePick') {
                return (
                  <Item
                    label={opt?.label}
                    key={`${idx}_${opt?.domKey}`}
                    style={{ marginBottom: 9, height: 23, width: opt?.width, fontSize: 13, marginLeft: 8 }}
                  >
                    <RangePicker size="small" separator="至" picker={picker} value={date} onChange={dateChange} />
                  </Item>
                );
              }
              if (opt?.type === 'searchNode') {
                return (
                  <Item
                    label={opt?.label}
                    key={`${idx}_${opt?.domKey}`}
                    style={{ marginBottom: 9 }}
                    className={'form-item'}
                  >
                    <div className="searchNode">
                      <TopicSearch
                        style={{ width: 160, height: 24 }}
                        onClear={() => {
                          keywordRef.current = '';
                          handleSearch && handleSearch('');
                        }}
                        onChange={(value: any) => {
                          keywordRef.current = value;
                        }}
                        onSearch={handleSearch}
                        placeholder={'请输入公司名称'}
                        cref={keywordRef}
                        dataKey={dataKey}
                      />
                    </div>
                  </Item>
                );
              }
              return (
                <Item
                  label={opt?.label}
                  key={`${idx}_${opt?.title ?? ''}`}
                  className={opt?.type === 'rangPickerPre' ? ' ' : S.screenFormItem}
                  style={{
                    marginRight: opt?.type === 'rangPickerPre' ? 6 : 8,
                    marginLeft: opt?.type === 'rangPickerPre' ? 8 : 0,
                    marginBottom: 9,
                  }}
                >
                  <Screen
                    onChange={(selected) => {
                      screenChange(opt?.key, selected);
                    }}
                    options={[opt.screenOption]}
                  />
                </Item>
              );
            })}
          </Group>
        </ScreenForm>
      </ScreenWrapper>
      <SkipExportWrap>
        <Operating style={{ alignItems: 'baseline' }}>
          {!isUndefined(condition.expireFlag) ? (
            <div className="checkBox">
              <Checkbox
                checked={condition.expireFlag === ''}
                onChange={(e) => {
                  handleCheck && handleCheck(condition.expireFlag === '' ? 1 : '');
                }}
              >
                含到期
              </Checkbox>
            </div>
          ) : null}
          <div className="total">
            共 <span>{formatNumber(total, 0) || 0}</span> 条
          </div>
          <ExportDoc
            condition={condition}
            filename={filename}
            // type={EXPORT}
            usePost={usePost}
            style={{ height: 25, fontSize: 13, fontWeight: 400 }}
          />
        </Operating>
      </SkipExportWrap>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: start;
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
`;

const ScreenWrapper = styled.div`
  display: flex;
  margin-right: 40px;
  > div {
    padding: 8px 0 0 0;
    margin-left: -8px;
    width: 100%;
  }

  .ant-picker-small {
    padding: 0 6px 0;
  }

  .searchNode {
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const SkipExportWrap = styled.div`
  display: flex;
  align-items: center;
  height: 35px;
`;

const Operating = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  white-space: nowrap;
  .checkBox {
    .ant-checkbox + span {
      padding-left: 4px;
      padding-right: 24px;
      font-size: 13px;
      color: #262626;
    }
    .ant-checkbox-inner {
      width: 12px;
      height: 12px;
    }
    .ant-checkbox-inner::after {
      left: 1px;
    }
    .ant-checkbox {
      top: 1px;
    }
  }
  .total {
    color: #8c8c8c;
    font-size: 13px;
    font-weight: 400;
    color: #8c8c8c;
    margin-right: 24px;
    span {
      color: rgb(51, 51, 51);
    }
  }
`;
