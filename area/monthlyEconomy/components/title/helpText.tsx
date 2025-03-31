import { FC } from 'react';

import styled from 'styled-components';

import { getConfig } from '@/app';

const hideAreaModalHelpText = getConfig((d) => d.modules.hideAreaModalHelpText);

const HelpText: FC = () => {
  /**帮助说明 */
  return (
    <>
      <H2Title>帮助说明</H2Title>
      <CommonContent>
        <h3>一、功能介绍</h3>
        <p style={{ marginBottom: '16px' }}>
          月度季度经济大全致力于提供及时、全面的地区经济运行信息，涉及国民经济核算、工业、投资、建筑与房地产、贸易、人民生活、存贷款、财政收支等十多个类别200+指标，重点指标覆盖了全国3000+省级、地级和县级行政区域。专题支持查看地区明细、指标详情图，同时提供了指标目录树、地区目录树、导出、指标排序、搜索、溯源、数据更新提示等功能，便于用户轻松获取所需数据。
        </p>
        <p>
          1、指标筛选及自定义功能：专题提供了指标目录树，支持一键勾选同一类别下所有指标，已选指标可自定义页面展示及导出顺序
          {!hideAreaModalHelpText
            ? ' ，支持指标搜索，保存、编辑指标模板，模板上限为10个，单次筛选上限提升至100个。同时，用户也可通过设置默认指标，自定义页面默认展示的指标内容'
            : ''}
          。
        </p>
        <img src={require('./images/img1.png')} alt="" />
        <p>
          2、地区筛选：专题提供了地区目录树，支持一键勾选所有省份、下属地级市、下属辖区，支持地区搜索，单次筛选上限提升至1000个。
        </p>
        <img src={require('./images/img2.png')} alt="" style={{ width: '600px' }} />
        <p>
          3、地区及指标详情：月度季度经济大全支持查看地区近12个月明细数据，支持跳转区域深度资料，查看更多区域详情。同时，所有指标均支持查看地区分布详情图。
        </p>
        <img src={require('./images/img3.png')} alt="" style={{ width: '600px' }} />
        <p>4、数据更新提示：专题对近一周数据更新、首次新增情况进行提示，支持查看数据历史更新记录。</p>
        <img src={require('./images/img4.png')} alt="" />
        <p>5、一键溯源：专题支持一键溯源功能，便于用户快速查询指标数据来源。</p>
        <img src={require('./images/img5.png')} alt="" />

        <h3>二、数据来源</h3>
        <p style={{ marginBottom: '24px' }}>
          月度季度经济大全展示数据均来源于统计月报、经济运行报告、统计部门发布的月/季度数据、政府官网等。
        </p>
        <div className="declare" style={{ marginTop: '16px' }}>
          免责申明：所有数据是大智慧财汇基于公开数据的收集、整理和加工，仅作为参考使用。对本模块有任何意见和建议，请与我们联系，
          线上反馈或拨打客服热线021-20219912
        </div>
      </CommonContent>
    </>
  );
};
export default HelpText;

const H2Title = styled.h2`
  font-size: 15px;
  line-height: 22px;
  color: #141414;
  padding: 10px 0 0 9px;
  margin: 0 0 8px;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 20px;
    transform: translateY(-50%);
    width: 3px;
    height: 14px;
    background: #ff7000;
    border-radius: 2px;
  }
`;
export const CommonContent = styled.div`
  padding: 0 8px;
  h3,
  p {
    color: #3c3c3c;
    font-size: 14px;
    text-align: justify;
    line-height: 28px;
  }
  h3 {
    margin-bottom: 2px;
  }
  p {
    margin-bottom: 8px;
    font-weight: 400;
  }
  video {
    margin-bottom: 23px;
    max-width: 100%;
  }
  img {
    margin: 8px 0 24px;
    max-width: 100%;
    image-rendering: -webkit-optimize-contrast;
  }
  .remarks {
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 24px;
    margin-bottom: 16px;
  }
  .declare {
    padding: 10px;
    border: 1px solid #e6e6e6;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 300;
    text-align: justify;
    color: #8c8c8c;
    line-height: 18px;
    margin-bottom: 22px;
  }
  .updateDate {
    height: 40px;
    /* background-image: url(${require('./images/updateBackground.png')}); */
    background-repeat: no-repeat;
    border-radius: 6px;
    line-height: 40px;
    color: #141414;
    padding-left: 16px;
    margin: 4px 0 12px;
    background-size: contain;
    @media only screen and (-webkit-min-device-pixel-ratio: 2) {
      /* background-image: url(${require('./images/updateBackground@2x.png')}); */
    }
  }
`;
