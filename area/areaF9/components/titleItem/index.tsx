import { FC, memo } from 'react';

import styled from 'styled-components';

import { Tooltip } from '@/components/antd';

import BxgsSrc from '../../assets/icon_qygy_bxgs.svg';
import CyjgSrc from '../../assets/icon_qygy_cyjg.svg';
import JjgsSrc from '../../assets/icon_qygy_jjgs.svg';
import XmmxSrc from '../../assets/icon_qygy_xmmx.svg';
import XmtjSrc from '../../assets/icon_qygy_xmtj.svg';
import XtgsSrc from '../../assets/icon_qygy_xtgs.svg';
import YhSrc from '../../assets/icon_qygy_yh.svg';
import ZlgsSrc from '../../assets/icon_qygy_zlgs.svg';
import ZqgsSrc from '../../assets/icon_qygy_zqgs.svg';
import ZyzbSrc from '../../assets/icon_qygy_zyzb.svg';

interface TitleItemProps {
  type: ItemEnum;
}

export enum ItemEnum {
  BXGS = '保险公司',
  CYJG = '产业结构',
  JJGS = '基金公司',
  XMMX = '项目明细',
  XMTJ = '项目统计',
  XTGS = '信托公司',
  ZLGS = '租赁公司',
  ZQGS = '证券公司',
  ZYZB = '主要指标',
  YH = '银行',
}

const TitleItem: FC<TitleItemProps> = (props) => {
  const { type } = props;
  const dateTypeMap = new Map<ItemEnum, { src: string; key?: string; tip?: string }>([
    [ItemEnum.BXGS, { src: BxgsSrc, key: 'finance_#insurance' }],
    [
      ItemEnum.CYJG,
      {
        src: CyjgSrc,
        key: '',
        tip: '注：数据均来源于统计公报、统计年鉴，实际披露中由于部分地区最新年度数据不全，导致年份间数据差距较大',
      },
    ],
    [ItemEnum.JJGS, { src: JjgsSrc, key: 'finance_#fund' }],
    [ItemEnum.XMMX, { src: XmmxSrc, key: '' }],
    [ItemEnum.XMTJ, { src: XmtjSrc, key: '' }],
    [ItemEnum.XTGS, { src: XtgsSrc, key: 'finance_#trust' }],
    [ItemEnum.ZLGS, { src: ZlgsSrc, key: 'finance_#rent' }],
    [ItemEnum.ZQGS, { src: ZqgsSrc, key: 'finance_#bond' }],
    [ItemEnum.ZYZB, { src: ZyzbSrc, key: '', tip: '' }],
    [ItemEnum.YH, { src: YhSrc, key: 'finance_#bank' }],
  ]);

  return (
    <Container
      className="title-item-container"
      id={dateTypeMap.get(type)?.key ? 'areaF9' + dateTypeMap.get(type)?.key : ''}
    >
      <img className="title-img" src={dateTypeMap.get(type)?.src} alt={'error'} />
      <div className="item-title">
        <span className="item-title-left">{type}</span>
        {dateTypeMap.get(type)?.tip ? (
          <Tooltip
            color="#fff"
            title={() => <TooltipContent>{dateTypeMap.get(type)?.tip}</TooltipContent>}
            getTooltipContainer={() => document.body}
          >
            <img src={require('@/assets/images/common/help.png')} alt="" />
          </Tooltip>
        ) : null}
      </div>
    </Container>
  );
};
export default memo(TitleItem);

const Container = styled.div`
  display: flex;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 10px;
  background: white;
  position: sticky;
  top: 0px;
  z-index: 3;
  flex-shrink: 0;
  .title-img {
    display: block;
    margin-right: 8px;
  }
  .item-title {
    display: flex;
    align-items: center;
    .item-title-left {
      margin-right: 6px;
      font-size: 13px;
      font-weight: 400;
      color: #3c3c3c;
    }
    img {
      width: 12px;
      height: 12px;
      cursor: pointer;
    }
  }
`;

const TooltipContent = styled.div`
  color: #434343;
  font-size: 12px;
  line-height: 20px;
  padding: 0 8px;
`;
