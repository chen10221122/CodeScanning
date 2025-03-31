import { FC, memo } from 'react';
import { useSelector } from 'react-redux';

import { Popover } from 'antd';
import styled from 'styled-components';

import { useParams } from '@pages/area/areaF9/hooks';

import { Image } from '@/components/layout';
import { LINK_AREA_DEVELOPMENT } from '@/configs/routerMap';
import MoreBtn from '@/pages/area/areaF9/components/traceBtn/moreBtn';
import { IRootState } from '@/store';
interface Props {
  backgroundImg?: string;
  title: string;
  info?: string;
  style?: any;
}

const TitleWithBackImg: FC<Props> = ({ backgroundImg, title, info, style = { padding: '12px 10px 8px 24px' } }) => {
  const { code } = useParams();
  const uInfo = useSelector((store: IRootState) => store.user.info);
  return (
    <TitleWithImg style={{ backgroundImage: `url(${backgroundImg})`, ...style }}>
      <div className="title" style={{ fontWeight: 500 }}>
        {title}
      </div>
      <div className="right">
        {info && uInfo.havePay === false ? (
          <ViewLimit>
            <Popover
              placement="bottomLeft"
              title=""
              content={
                <PowerTip>刷新、加载、筛选、搜索、排序、页码切换均记录体验次数，成为VIP会员即可无限次查看</PowerTip>
              }
              trigger="hover"
              arrowPointAtCenter
              align={{ offset: [-20, 0] }}
            >
              <Image
                width={13}
                height={13}
                style={{ cursor: 'pointer' }}
                src={require('./images/iconClose-Circle-Fill2x.png')}
                src1x={require('./images/iconClose-Circle-Fill2x.png')}
                src2x={require('./images/iconClose-Circle-Fill2x@2x.png')}
              ></Image>
            </Popover>
            <div style={{ height: 17 }}>{info}</div>
          </ViewLimit>
        ) : null}
        {/* <Intro
          leftAnchorList={['帮助说明']}
          rightContentList={[
            {
              title: '帮助说明',
              content: (
                <IntroContent>
                  <div className="textWrap">
                    <h3>一、总体介绍</h3>
                    <p>
                      开发区是地方政府为促进区域经济迅速发展而设置的专门机构。为了全面展示全国所有开发区的经济发展情况，财汇对开发区的数据进行收集、整理及加工，推出开发区专题。
                      <br />
                      开发区对比：包含多开发区对比和开发区历年经济数据。主要展示全国2700余家（逐年增加）国家级、省级开发区的基本信息、经济、财政债务以及产业发展数据。多开发区对比时，可通过开发区类别、地区、年份进行筛选，根据GDP、税收收入、地方政府债务等指标进行升降序查询，支持开发区名称关键词模糊搜索。
                    </p>
                    <p>
                      1、指标筛选及自定义功能：专题提供了指标目录树，支持一键勾选同一类别下所有指标，已选指标可自定义页面展示及导出顺序
                      {!hideAreaModalHelpText
                        ? '，支持指标搜索，保存、编辑指标方案，方案上限为10个，单次筛选上限提升至100个。同时，用户也可通过设置默认指标，自定义页面默认展示的指标内容'
                        : ''}
                      。
                    </p>
                    <img src={require('./images/indicators@2x.png')} alt="" />
                    <p>
                      2、地区层级筛选：专题提供了地区目录树，支持一键勾选所有省份、下属地级市、下属辖区，支持地区搜索，单次筛选上限提升至1000个。
                    </p>
                    <img src={require('./images/areaSelect@2x.png')} alt="" />
                    <p>
                      3、地区及指标详情：开发区专题支持查看地区近5年明细数据，支持跳转区域经济速览，查看更多地区详情。同时，所有指标均支持查看地区分布详情图。
                    </p>
                    <img src={require('./images/detailModal@2x.png')} alt="" />
                    <p>
                      4、一键溯源：专题支持一键溯源功能，便于用户快速查询指标数据来源。目前部分指标可溯源，更多指标溯源将陆续上线。
                    </p>
                    <h3>二、数据来源</h3>
                    <p>
                      开发区管委会官网、《开发区年鉴》、开发区协会官网等、地方人民政府官网、国家发改委官网、国家统计局等。
                      其中，主导产业类别划分根据开发区实际数据，依据国家统计局《新产业新业态新商业模式统计分类》整理所得。
                    </p>
                    <h3>三、指标释义</h3>
                    <p>
                      <span>1、转移支付收入 = 一般性转移支付+专项转移支付</span>
                      <br />
                      <span>2、财政自给率 = 一般公共预算收入*100% / 一般公共预算支出</span>
                      <br />
                      <span>3、负债率 = 地方政府债务余额*100%/GDP</span>
                      <br />
                      <span>4、负债率(宽口径) = (地方政府债务余额+有息债务余额)*100%/GDP</span>
                      <span>
                        5、债务率 = 地方政府债务余额*100%/地方政府综合财力
                        <br />
                        其中，地方政府综合财力指标具有多种口径定义，大智慧财汇参考最新的政府收支分类科目和数据的可得性，采用了如下的近似计算方法：
                        地方政府综合财力 = 一般公共预算收入＋转移性收入＋政府性基金收入＋国有资本经营预算收入
                      </span>
                      <span>
                        6、债务率(宽口径) = (地方政府债务余额+地区融资平台有息债务余额) *100%/地方政府综合财力
                      </span>
                    </p>
                    <div className="declare">
                      免责申明：所有数据是大智慧财汇基于公开数据的收集、整理和加工，仅作为参考使用。对本模块有任何意见和建议请与我们联系,
                      线上反馈或拨打客服热线021-20219912。
                    </div>
                  </div>
                </IntroContent>
              ),
            },
          ]}
          pageCode="areaDevelop"
          updatedVersionDate={'2022-7-10'}
        /> */}
        <MoreBtn linkTo={LINK_AREA_DEVELOPMENT + `?code=${code}`} style={{ marginLeft: '24px' }} />
      </div>
    </TitleWithImg>
  );
};
export default memo(TitleWithBackImg);
const TitleWithImg = styled.div`
  // border-bottom: 1px solid rgba(1, 113, 246, 0.3);
  position: sticky;
  top: 0;
  background-color: #fff;
  // height: 56px;
  font-size: 14px;
  // min-height: 36px;
  font-weight: 500;
  text-align: left;
  color: #141414;
  /* padding: 12px 10px 8px 24px; */
  z-index: 9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .right {
    display: flex;
  }
  .title {
    font-size: 15px;
    font-weight: 500;
    text-align: left;
    color: #141414;
    line-height: 23px;
    position: relative;
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      left: -8px;
      top: 4px;
      width: 3px;
      height: 14px;
      background: #ff9347;
      border-radius: 2px;
    }
  }
  // @media (min-width: 1366px) {
  //   padding: 0 72px;
  // }
`;

const ViewLimit = styled.div`
  font-size: 12px;
  color: #434343;
  margin-right: 15px;
  display: flex;
  align-items: center;
  position: relative;
  font-family: PingFangSC, PingFangSC-Regular;
  & > img {
    margin-right: 4px;
  }
  &:after {
    content: '';
    position: absolute;
    display: block;
    right: -15px;
    top: 3px;
    bottom: 2px;
    width: 1px;
    background-color: #ececec;
  }
`;

const PowerTip = styled.div`
  width: 240px;
  color: rgba(0, 0, 0, 0.65);
  line-height: 19px;
  font-size: 12px;
`;

// const IntroContent = styled.div`
//   .textWrap {
//     max-width: 700px;
//   }
//   p,
//   h3 {
//     color: #3c3c3c;
//     font-weight: 500;
//     font-size: 14px;
//     line-height: 28px;
//     margin-bottom: 2px;
//   }
//   p {
//     margin-bottom: 16px;
//     font-weight: 400;
//     span {
//       display: inline-block;
//     }
//   }
//   .subtitle {
//     color: #ff7500;
//   }
//   .declare {
//     font-size: 12px;
//     font-weight: 300;
//     color: #8c8c8c;
//     line-height: 20px;
//     border: 1px solid #e4e4e4;
//     border-radius: 4px;
//     padding: 8px 16px;
//   }
//   img {
//     margin-bottom: 24px;
//     &:first-of-type {
//       width: 670px;
//       height: 358px;
//     }
//     &:nth-of-type(2) {
//       width: 600px;
//       height: 388px;
//     }
//     &:nth-of-type(3) {
//       width: 700px;
//       height: 337px;
//     }
//   }
// `;
