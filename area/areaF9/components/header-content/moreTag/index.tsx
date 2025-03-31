import { useState, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import dayjs from 'dayjs';
import styled from 'styled-components';

import { Popover } from '@/components/antd';
import Arrow from '@/pages/area/areaF9/assets/arrow.svg';
import ArrowHover from '@/pages/area/areaF9/assets/arrow_hover.svg';
// import AreaTag from '@/pages/area/areaF9/components/header-content/AreaTag';
// import { useAreaTag } from '@/pages/area/areaF9/components/header-content/AreaTag/useAreaTag';
import Tag from '@/pages/area/areaF9/components/header-content/Tag';
import { useTypeTag } from '@/pages/area/areaF9/components/header-content/typeTag/useTypeTag';

import style from '@/pages/area/areaF9/components/header-content/moreTag/style.module.less';
interface Props {
  moreType: string;
  /** 人口规模类型 */
  populationSize: string;
  cityParty: any;
}

const MoreTag = ({ moreType, populationSize, cityParty }: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  /** 更多下拉浮窗显示 */
  const [visible, setVisible] = useState<boolean>(false);

  const handleVisibleChange = useMemoizedFn((visible) => {
    setVisible(visible);
  });
  const { largeCityData, largeCityParams, cityPartyData, cityPartyParams } = useTypeTag({ populationSize, cityParty });
  // const { areaList, areaAllCount, areaCondition } = useAreaTag();
  const formateCityData = useMemoizedFn((data) => {
    return data.map((item: any) => ({ key: item?.name, ...item }));
  });
  /** 人口规模和榜单以及城市群捆绑 */
  const getListContent = useMemoizedFn((flag) => {
    const hasTypeTag = flag ? moreType : !moreType;
    // const hasAreaTag = flag ? moreType : !moreType;
    const hasCityTag = flag ? moreType === '2' : moreType !== '2';
    return (
      <>
        {/** 城市群 */}
        {cityParty && hasCityTag ? (
          <Tag
            data={cityPartyData}
            title={cityParty?.[0]?.name}
            tabConfig={cityParty?.length > 1 ? formateCityData(cityParty) : null}
            showMore={moreType === '2'}
            setListVisible={setVisible}
            condition={{ condition: cityPartyParams, module_type: 'area_circle_detail' }}
            filename={`${cityParty?.[0]?.name}_GDP_${dayjs().format('YYYYMMDD')}`}
            isCity={false}
          />
        ) : null}
        {/** 人口规模 */}
        {populationSize && hasTypeTag ? (
          <Tag
            data={largeCityData}
            title={populationSize}
            tabConfig={null}
            showMore={!!moreType}
            setListVisible={setVisible}
            condition={{ condition: largeCityParams, module_type: 'area_population_top' }}
            filename={`${populationSize}_城区常住人口_${dayjs().format('YYYYMMDD')}`}
            isCity={true}
          />
        ) : null}
        {/* 榜单 */}
        {/* {areaAllCount && hasAreaTag ? (
          <AreaTag
            showMore={!!moreType}
            list={areaList}
            allCount={areaAllCount}
            condition={areaCondition}
            setListVisible={setVisible}
          />
        ) : null} */}
      </>
    );
  });

  return (
    <Container ref={wrapRef}>
      {getListContent(false)}
      {(largeCityData && moreType) || (cityPartyData && moreType === '2') ? (
        <Popover
          placement="bottomRight"
          visible={visible}
          onVisibleChange={handleVisibleChange}
          content={getListContent(true)}
          overlayClassName={style['list-popover']}
          getPopupContainer={() => wrapRef.current || document.body}
          align={{ offset: [0, -4] }}
        >
          <TagsContent>
            <div className="content">更多</div>
          </TagsContent>
        </Popover>
      ) : null}
    </Container>
  );
};

export default MoreTag;

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
  .ant-popover-placement-rightTop {
    .ant-popover-arrow-content {
      transform: translateX(4.24px) rotate(45deg) !important;
    }
    .ant-popover-arrow {
      top: 12px !important;
    }
  }
  /* 表格样式 */
  .ant-table-container {
    border-color: #f2f4f9;
  }
`;

const TagsContent = styled.div`
  cursor: pointer;
  height: 20px;
  margin-left: 8px;
  display: flex;
  align-items: center;
  color: #0171f6;
  .content {
    line-height: 18px;
    font-size: 12px;
    margin-right: 2px;
  }
  &::after {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background: url(${Arrow}) center center no-repeat;
    background-size: 100% 100%;
  }
  &:hover {
    cursor: pointer;
    &::after {
      content: '';
      background: url(${ArrowHover}) center center no-repeat;
    }
  }
`;
