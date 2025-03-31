import { useCallback, useRef, useState, memo } from 'react';

import { Radio } from 'antd';
import { isEqual, noop } from 'lodash';

import { Screen } from '@/components/screen';
import TopicSearch from '@/components/topicSearch';
import { AREA_FINANCING_PLATFORM } from '@/configs/localstorage';
import menuConfig from '@/pages/bond/areaFinancingPlatform/components/filter/menuConfig';

import { CONTAINS, SELFS } from '../../../config/platforms';

const Filter = (props: any) => {
  const { isCounty, onRadioChange, levelData, regionCode, onMenuChange, onSeach } = props;
  const [keyword, setKeyword] = useState('');
  const keywordRef = useRef({});

  //点回车后保存搜索记录  并返回tag
  const handleSearch = useCallback(
    (curKeyword) => {
      if (isEqual(keyword, curKeyword)) return;
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      keywordRef.current = curKeyword;
      setKeyword(curKeyword);
      onSeach(curKeyword);
    },
    [keyword, onSeach],
  );
  return (
    <span className="screen-left-wrap">
      <Radio.Group
        key={`${levelData?.level}${isCounty}`} // 加个key，让defaultValue准确生效
        onChange={onRadioChange}
        defaultValue={isCounty ? SELFS : CONTAINS}
      >
        {!isCounty ? <Radio value={CONTAINS}>含下属辖区</Radio> : null}
        <Radio value={SELFS}>本级</Radio>
      </Radio.Group>
      <div style={{ left: '0px!important' }} className="area-scree-con">
        <Screen
          key={regionCode + levelData?.level}
          options={menuConfig}
          onChange={onMenuChange}
          getPopContainer={() => document.getElementById('areaEconomyPlatformScreenContainer') as HTMLElement}
        />
      </div>
      <div className="search">
        <TopicSearch
          cref={keywordRef}
          style={undefined}
          onClear={() => {
            handleSearch('');
          }}
          onChange={noop}
          onSearch={handleSearch}
          dataKey={AREA_FINANCING_PLATFORM}
          placeholder="请输入平台关键字"
        />
      </div>
    </span>
  );
};

export default memo(Filter);
