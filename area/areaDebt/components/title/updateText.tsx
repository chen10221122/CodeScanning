import { FC } from 'react';

import { CommonContent } from '@/components/dialog/helpUpdateRemind';
const UpdateText: FC = () => {
  return (
    <CommonContent>
      <div className="updateDate">2023年5月更新内容</div>
      <h3>区域经济大全全新升级--指标拓展、计算指标溯源、数据流更新、新增意见反馈</h3>
      <p>1、指标拓展：在原有基础上增加存贷款(人民币)、财政及债务本级近百种指标。</p>
      <img src={require('./images/image1.png')} alt="" style={{ width: '670px' }} />
      <p>2、计算指标溯源：一键溯源功能升级，支持查看计算指标计算过程明细。</p>
      <img src={require('./images/image2.gif')} alt="" style={{ width: '670px' }} />
      <p>3、数据更新提示：专题对近一周、近一月数据更新、首次新增情况进行提示，并支持查看数据历史更新记录。</p>
      <img src={require('./images/image3.gif')} alt="" style={{ width: '670px' }} />
      <p>4、意见反馈：新增意见反馈功能，问题、需求随时反馈，高效沟通。</p>
      <img src={require('./images/image4.png')} alt="" style={{ width: '670px' }} />

      <div className="updateDate">2022年8月更新内容</div>
      <h3>区域经济大全全新升级</h3>
      <p>
        1、指标拓展：在原有基础上增加GDP产业结构、常住人口、上级补助收入、债券还本付息等100+指标。区域经济大全展示指标涵盖国民经济核算、人口、工业、投资、贸易、房地产、财政收支等十多个类别，近200个核心指标。
      </p>
      <img src={require('./images/image01.png')} alt="" style={{ width: '670px' }} />
      <p>
        2、指标层级细化：专题提供了全新的指标层级树，指标层级更为清晰。支持指标层级一键展开及收起，支持一键勾选同一类别下所有指标，已选指标可自定义页面展示及导出顺序，单次筛选上限提升至100个。
      </p>
      <img src={require('./images/image02.gif')} alt="" />
      <p>
        3、自定义指标模板：选择指标后，点击“另存模板”，即可保存为”我的模板”，便于用户快捷筛选。已保存模板也可编辑更新，模板上限提升为10个。同时，用户也可通过设置默认指标，自定义页面默认展示的指标内容。
      </p>
      <img src={require('./images/image03.png')} alt="" style={{ marginBottom: '0px', width: '670px' }} />
    </CommonContent>
  );
};
export default UpdateText;
