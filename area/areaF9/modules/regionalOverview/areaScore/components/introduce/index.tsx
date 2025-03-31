import { memo, useState } from 'react';

import { ProModalHelp } from '@dzh/pro-components';
import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import Explain from '@/pages/area/areaF9/assets/icon_explain.svg';
import Table1 from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/introduce/table1';
// import Table2 from '@/pages/area/areaF9/modules/regionalOverview/areaScore/components/introduce/table2';

const CommonContent = styled.div`
  // min-width: 706px;
  overflow-x: auto;
  .title {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    color: #3c3c3c;
    margin-bottom: 2px;
    &.second {
      padding-top: 8px;
    }
    &.top16 {
      margin-top: 16px;
    }
  }

  .mgtop16 {
    padding-top: 16px;
  }

  > p {
    .bold {
      font-weight: 600;
    }
  }

  .note {
    font-size: 12px;
    font-weight: 300;
    color: rgb(140, 140, 140);
    line-height: 18px;
  }

  th,
  td {
    font-size: 13px;
    height: 20px;
    line-height: 20px;
  }

  td {
    color: #141414 !important;
  }

  th {
    color: #262626 !important;
  }

  th::before {
    display: none;
  }
  .ant-table-container {
    border-top: none;
  }

  .ant-table-thead > tr > th.ant-table-cell {
    padding: 5px 8px;
    border-top: 1px solid #ebf1fc;
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #262626;
    line-height: 18px;
    background: #f3f8ff !important;
  }

  .ant-table-tbody > tr.ant-table-row td {
    background: #fff !important;
  }

  .ant-table-tbody > tr.ant-table-row > td.ant-table-cell {
    padding: 5px 8px;
    font-size: 12px;
  }

  .ant-table-tbody > tr.ant-table-row:hover > td.ant-table-cell {
    background: #edf4fe !important;
  }
`;

const content = [
  {
    title: '区域评分介绍',
    content: (
      <>
        <CommonContent>
          <div className="title">一、区域评分背景</div>
          <p>
            区域评分模型是一种用于评估区域综合实力的分析工具。为适应市场趋势和满足客户需求，2020年预警通推出了初版的区域评分模型，初版区域评价体系在经济、财政、债务、产业状况和舆情维度上细分了11个指标。但随着数据应用的深化，用户对区域评分提出了新的需求，如拓展指标体系、追溯历史评分和支持不同行政等级地区比较等。因此，预警通在原版的基础上进行迭代升级，以满足用户更深入的分析需求。
          </p>

          <div className="title second">二、区域评分模型</div>
          <p>区域评分模型的具体介绍主要围绕指标体系、权重设置和打分机制的这三个方面展开。</p>
          <p>
            <span className="bold">指标体系：</span>
            新版指标体系在原版区域经济、财政和债务的基础上新增区域的科技水平、金融资源和信用风险维度指标，拓展指标的维度和深度，提升指标体系的科学性和合理性。在区域经济方面，新增了城镇人均可支配收入和城镇化率等关注度高的指标；在财政领域，引入了地方政府综合财力等重要指标；而在债务领域，负债率等指标被纳入。在选取科技水平、金融资源和信用风险的指标方面主要考虑两个因素。一是选取数据覆盖面相对较大、用户关注度比较高的指标；二是选取能够体现区域实力的指标。例如：金融资源的股票市场资本化率、信用风险的不良贷款率和科学技术的R&D经费投入强度等。
          </p>
          <p>
            <span className="bold">权重设置：</span>
            新版评分模型权重设置是在统计分析的基础上，结合专家意见适当调整，以确保权重分配既科学又具有实际操作性。在区域综合评价中经济、财政和债务占据主要地位，并且这部分数据相对完整，因此，经济、财政和债务权重较高。除以上外，金融资源在区域综合发展过程中发挥作用较大，因此金融资源维度占据一定权重。科学技术和信用风险的指标因缺乏普适性在整体评价体系中的权重占比相对较小。维度内细项指标的权重划分主要依据指标对区域发展的影响程度。例如：GDP在经济实力维度、一般公共预算收入在财政实力维度、存贷款余额在金融资源维度等指标在很大程度上能直接反映地区的实力，因此在权重分配上占据较大比重。
          </p>
          <p>
            <span className="bold">打分机制：</span>
            原有的打分机制是按省、市、区县行政等级划分，依据指标值的相对位置以5分制折算得分。这种方式导致了数据间的割裂，使得省、市、区县之间的最终取值难以进行横向比较。为克服这一缺陷，采用了新的打分标准——分档打分法。该方法将指标数据划分为若干档次，每个档次内的数据根据一定的计算方式得出对应得分。结合市场情况和客户反馈，将得分设定为10档，最高得分为10分，最低得分为0分。在档内，采用线性回归的方式为数据赋予具体得分。这样使得省、市、区县之间数据具备可比性。
          </p>
          <p>基于上述改进，构建了一套全新的评分体系。如下表所示：</p>

          <Table1 />

          <p className="mgtop16">为确保评分的准确性与合理性，可以从以下几个方面验证：</p>
          <p>
            1.区域评分的总体分布情况近似符合正态分布，中间高，两边低。这种分布情况基本符合实际区域经济发展格局，经济高度发达和相对落后的地区数量占比小，而大多数地区都集中在评分的中等水平。
          </p>
          <p>
            2.历年地区评分数据波动相对平稳。地区评分趋势总体保持平稳上升，历年数据之间的波动性较小，这表明地区经济总体呈现上升趋势，地区经济波动性小，基本符合经济发展趋势。
          </p>
          <p>
            3．评分结果与地区的经济状况基本一致。在验证过程中，根据得分情况与实际情况进行对照，来验证数据的准确性。以北京市为例，朝阳区、海淀区、东城区和西城区凭借地理位置和资源优势在北京市中占据有利地位，地区经济发展水平高，评分相对较高；延庆区、门头沟区和密云区相对发展较缓，评分相对较低。这基本符合地区发展现状。
          </p>

          <div className="title top16">三、区域评分模型的完善</div>
          <p>
            区域发展的影响因素有很多。本模型主要围绕在区域经济、财政、债务、金融资源、科学技术和信用风险这6个方面，得到的评分不能很全面的展示地区实力。后续优化可考虑更多定性和定量指标，如：市场营商环境、区域属性和区域舆情等。
          </p>

          <div className="note">
            备注：数据主要来源于政府官网、统计公报、统计年鉴、政府经济运行报告和财政预决算、政府官网、交易所网站、企业官方网站和票交所等渠道。评分指标数据取自2019年以来的年度数据。
          </div>
          {/* <Table2 /> */}
        </CommonContent>
      </>
    ),
  },
];

const Introduce = () => {
  const [visible, setVisible] = useState(false);

  const openModalHandel = useMemoizedFn(() => {
    setVisible(!visible);
  });

  return (
    <Intro>
      <div className="popover-explain" onClick={openModalHandel}>
        <img className="icon-explain" alt="" src={Explain} />
        <span className="explain-text">区域评分介绍</span>
      </div>
      <div className="intro-modal" id="intro-modal">
        <ProModalHelp title="区域评分介绍" visible={visible} onCancel={openModalHandel} content={content} />
      </div>
    </Intro>
  );
};

export default memo(Introduce);

const Intro = styled.div`
  .popover-explain {
    display: flex;
    align-items: center;
    margin-left: 24px;
    cursor: pointer;
    user-select: none;
    .icon-explain {
      margin-right: 4px;
      // margin-bottom: 2px;
      width: 13px;
      height: 13px;
    }
    > span {
      &.explain-text {
        font-size: 13px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #141414;
        line-height: 20px;
      }
    }
  }
`;
