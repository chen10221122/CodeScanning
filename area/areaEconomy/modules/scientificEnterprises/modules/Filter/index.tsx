import { useRef, useCallback } from 'react';

import classnames from 'classnames';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { Screen } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import { TECH_ENTERPRISE_SEARCH_HISTORY } from '@/configs/localstorage';

import { useGetAllIndustry } from '../../hooks/useGetAllIndustry';
import PointerDown from '../../image/arrow_down.png';
import styles from './style.module.less';

function Filter({ change, setIsFirstLoading, hash }: any) {
  const searchLineRef = useRef(null);
  /** 关键词 */
  const keywordRef = useRef(null);
  /** 筛选 */
  const { options } = useGetAllIndustry({ setIsFirstLoading });

  const handleChange = useCallback(
    (type, value) => {
      change(type, value);
    },
    [change],
  );

  return (
    <div className={styles['screenLine']}>
      <div key={hash} className={styles['screenAndSearch']} ref={searchLineRef}>
        <>
          <TopicSearch
            onClear={() => handleChange('searchChange', '')}
            onChange={(value: any) => {
              keywordRef.current = value;
            }}
            cref={keywordRef}
            style={{
              marginRight: '24px',
            }}
            focusedWidth={224}
            wrapperWidth={58}
            onSearch={(value: string) => handleChange('searchChange', value)}
            dataKey={TECH_ENTERPRISE_SEARCH_HISTORY}
          />
          <div className={classnames(styles['screen'])}>
            {!isEmpty(options) ? (
              <>
                {!isEmpty(options?.[0]?.option?.children) ? (
                  <Screen
                    onChange={(current) => handleChange('areaChange', current)}
                    options={[options[0] as any]}
                    getPopContainer={() => document.body}
                  />
                ) : (
                  <EmptyScreen>
                    下属辖区 <span className="" />
                  </EmptyScreen>
                )}
                <Screen
                  onChange={(current) => handleChange('industryChange', current)}
                  options={[options[1] as any]}
                  getPopContainer={() => document.body}
                />
                <Screen
                  onChange={(current) => handleChange('amountChange', current)}
                  options={[options[2] as any]}
                  getPopContainer={() => document.body}
                />
                <Screen
                  onChange={(current) => handleChange('otherChange', current)}
                  options={[options[3] as any]}
                  getPopContainer={() => document.body}
                />
              </>
            ) : null}
          </div>
        </>
      </div>
    </div>
  );
}

export default Filter;

const EmptyScreen = styled.div`
  width: 64px;
  height: 22px;
  color: #8c8c8c;
  font-size: 13px;
  cursor: not-allowed;
  padding-top: 1px;
  & > span {
    width: 7px;
    height: 7px;
    margin-bottom: 1px;
    display: inline-block;
    background: url('${PointerDown}');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
`;
