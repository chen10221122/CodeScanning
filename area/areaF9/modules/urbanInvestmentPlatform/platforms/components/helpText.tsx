import { memo, useState } from 'react';

import styled from 'styled-components';

import { Modal } from '@/components/antd';
import Icon from '@/components/icon';

const Intro = () => {
  const [visible, setVisible] = useState(false);

  return (
    <IntroWrap>
      <MyModal
        title="帮助说明"
        type="titleWidthBgAndMaskScroll"
        width={680}
        visible={visible}
        destroyOnClose={true}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <IntroContent>
          <h3>1.总体介绍</h3>
          <p>
            地方城投平台指从事地方政府指定或委托的公益性或准公益性项目的融资、投资、建设和运营的主体。用户可以从地区、城投平台的重要性、行政等级、股东、政府是否直接控股、城投口径等角度检索相应的城投企业信息。指标涵盖了城投评分、省内排名、总资产、政府补助、有息债务、授信余额和非标融资等多项指标，城投评分依据财汇构建的城投评分模型计算而来并依据评分得出平台省内排名。
          </p>
          <h3>2.数据来源</h3>
          <p>
            银保监会、财汇城投债券数据库（城投企业定义参考中债估值中心城投企业标准）、财务定期报告、债券公告、上市公告等。
          </p>
          <h3>3.指标释义</h3>
          <p>
            <span>
              <i>城投评分：</i>
              城投评分从地区和平台两个维度构建评分模型，选取关键指标展示指标值及分数。其中指标值选取最新年报数据，若未披露则使用上一年数据计算打分。地区/平台指标值比较维度为全国相同行政等级地区或平台公司，通过指标值排序得到最优值并拟定为5分，以此为基准转换其他地区及平台得分，再根据指标权重进一步计算总分
            </span>
            <span>
              <i>行政等级：</i>将地方城投平台所属地区分为省级、地市级和区县级
            </span>
            <span>
              <i>股东背景：</i>根据地方城投平台的实控人划分为政府、财政、国资委和其他
            </span>
            <span>
              <i>股权关系：</i>根据地方城投平台与政府及相关部门的股权关系划分为直接控股和间接控股
            </span>
            <span>
              <i>平台重要性：</i>
              财汇根据城投企业的行政等级、股东背景、股权关系、企业规模和平台唯一性等因素建立模型打分生成，分为重要平台、主要平台和一般平台
            </span>
            <span>
              <i>城投口径：</i>根据中债估值中心和银保监会对城投企业认定标准划分
            </span>
            <span>
              <i>主体评级：</i>剔除中债资信、国外三大评级公司（惠誉、穆迪、标准普尔）取最新主体评级
            </span>
            <span>
              <i>土地资产：</i>定报或募集说明书中披露的各项土地资产合计
            </span>
            <span>
              <i> 应收类款项来自政府占比：</i>
              取自财务附注中应收账款前五名、其他应收账款前五名来自政府收入与应收账款及其他应收账款合计值的占比
            </span>
            <span>
              <i>公益性&准公益性主营占比：</i>
              营业收入中公益性、准公益性项目收入合计值与营业收入总值的占比。其中公益性、准公益性参考中债估值中心对公益性及准公益性主营项目的划分标准，公益性包括城市开发及基础设施建设项目、土地开发项目、公益性住房项目、公益性事业；准公益性包括公共服务项目、公共交通建设运营项目
            </span>
            <span>
              <i>有息债务：</i>
              短期债务与长期债务之和。其中，短期债务=短期借款+一年内到期的非流动负债+应付短期债券+拆入资金+卖出回购金融资产款+向中央银行借款+吸收存款及同业存放+交易性金融负债，长期债务=长期借款+应付长期债券+长期应付款+租赁负债。
            </span>
            <span>
              <i> 非标融资：</i>
              数据来源于财务定报及募集说明书中披露的长期借款、短期借款、一年内到期的非流动负债、其他流动负债、其他非流动负债、长期应付款及其他权益工具等科目识别的城投非标债务加总得到
            </span>
            <span>
              <i>私募债占比：</i>
              私募债与债券余额的比值。其中私募债指非公开发行的债券，含定向发行、交易所ABS、银行间PPN、非公开发行公司债等债券类型
            </span>
            <span>
              <i>一年内到期债券占比：</i>一年内到期（含一年）的债券余额与债券余额的比值
            </span>
            <span>
              <i>债务资本化比率：</i>有息债务/(有息债务+所有者权益)*100%
            </span>
            <span>
              <i>对外担保比例：</i>
              发债公告中披露的担保比率或实际发生担保数额与公司净资产（含少数股权）的比例，优先取公告中披露的数据
            </span>
            <span>
              <i>EBITDA/利息：</i>（息税前利润（EBIT）+折旧费用+摊销费用）/利息费用
            </span>
            <span>
              <i>地区/平台利差：</i>
              根据归属于该地区/平台的城投样本券利差算术平均计算得出。（剔除永续债、ABS、可转债及剩余期限半年以内或5年以上个券）其中城投样本券利差为该债券的中债估值收益率与同期限国开收益率差值计算得出
            </span>
          </p>
          <div className="remarks">
            备注：定量数据中除债券余额及各债券类型占比、授信总额、授信余额、对外担保金额、对外担保比例、债务杠杆展示最新数据，其余指标均为最新报告期年报数据
          </div>
          <div className="declare">
            免责申明：所有数据是大智慧财汇基于公开数据的收集、整理和加工，仅作为参考使用。对本模块有任何意见和建议，请与我们联系，或拨打客服热线021-20219912
          </div>
        </IntroContent>
      </MyModal>
      <div className="trigger" onClick={() => setVisible(true)}>
        <Icon unicode="&#xe704;" className="question-icon" />
        <div className="txt">帮助说明</div>
      </div>
    </IntroWrap>
  );
};

export default memo(Intro);

const MyModal = styled(Modal)`
  .ant-modal-body {
    height: 397px;
    overflow-y: auto;
    padding-right: 18px;
    margin-right: 8px;
    margin-bottom: 20px;
    padding-bottom: 0;
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 6px;
      background: #cfcfcf;
    }
  }
`;

const IntroWrap = styled.div`
  // height: 100%;
  display: flex;
  align-items: center;
  margin-left: 15px;
  margin-right: 4px;
  .trigger {
    cursor: pointer;
    display: flex;
    align-items: center;
    .txt {
      font-size: 13px;
      font-weight: 400;
      color: #141414;
      height: 13px;
      line-height: 13px;
    }
  }
`;

const IntroContent = styled.div`
  h3,
  p,
  .remarks {
    color: #3c3c3c;
    font-size: 14px;
    text-align: justify;
  }
  h3 {
    margin-bottom: 4px;
    font-weight: 500;
    line-height: 21px;
  }
  p {
    margin-bottom: 8px;
    font-weight: 400;
    line-height: 26px;
    span {
      display: block;
      i {
        color: #ff7500;
        font-style: normal;
      }
    }
  }
  .remarks {
    margin-top: 16px;
    font-weight: 500;
    line-height: 20px;
  }
  .declare {
    margin-top: 12px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 300;
    text-align: justify;
    color: #8c8c8c;
    line-height: 18px;
  }
`;
