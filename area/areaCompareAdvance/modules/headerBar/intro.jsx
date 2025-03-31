import HelpUpdateRemind, { CommonContent } from '@/components/dialog/helpUpdateRemind';

const leftAnchorList = ['功能介绍', '指标释义'];
const rightContentList = [
  {
    title: '功能介绍',
    content: (
      <CommonContent>
        <p style={{ marginBottom: '16px' }}>
          区域对比工具专题致力于提供多维便捷的区域对比功能，涵盖了区域属性、GDP、人口与收入、工业、投资、房地产、财政与债务、融资、城投、区域企业等十四个维度近500个核心指标，地区下沉至区县，覆盖了全国3000+省级、地级和县级行政区域。同时，专题支持保存常用方案、显示最值、导出等功能，便于用户轻松获取所需数据。
        </p>
        <p>
          1、指标筛选及记住指标：专题提供了指标目录树，支持一键勾选同一类别下所有指标；支持记住指标，用户可记住常用的指标模板，快速查看关注信息。
        </p>
        <img src={require('../../imgs/help1@2x.png')} alt="" width={600} />

        <p>
          2、添加地区及记住地区：专题提供了地区目录树，支持一次勾选多个地区，已选地区支持单个切换。支持记住地区，用户可记住常用的地区，快速查看关注信息。
        </p>
        <img src={require('../../imgs/help2@2x.png')} alt="" width={694} />

        <p>3、指标详情：支持查看地区分布详情图，可视化直观对比区域实力。</p>
        <img src={require('../../imgs/help3@2x.png')} alt="" width={600} />

        <p>4、指标明细：下属辖区、地区综合评分等指标支持查看明细数据。</p>
        <img src={require('../../imgs/help4@2x.png')} alt="" width={600} />

        <p>5、一键溯源：专题支持一键溯源功能，便于用户快速查询指标数据来源。</p>
        <img src={require('../../imgs/help5@2x.png')} alt="" width={694} />
      </CommonContent>
    ),
  },
  {
    title: '指标释义',
    content: (
      <CommonContent>
        <p>
          1、地区评分基于最新年度数据计算得出，若未披露则使用上一年数据计算打分。地区/指标值比较维度为全国相同行政等级地区，通过指标值排序得到最优值并拟定为5分，以此为基准转换其他地区得分，再根据指标权重进一步计算总分。
        </p>

        <p>2、是否百强市、是否百强县数据发布方为赛迪顾问或华顿经济研究院。</p>

        <p>3、常住人口变动数=本年常住人口-去年同期常住人口</p>

        <p>4、常住人口增长率=(本年常住人口-去年同期常住人口) *100%/去年同期常住人口</p>

        <p>5、户籍人口变动数=本年户籍人口-去年同期户籍人口</p>

        <p>6、户籍人口增长率=(本年户籍人口-去年同期户籍人口) *100%/去年同期户籍人口</p>

        <p>7、税收占比=税收收入*100%/一般公共预算收入</p>

        <p>8、税收占比(本级)=税收收入(本级)*100%/一般公共预算收入(本级)</p>

        <p>9、非税收入占比=非税收入*100%/一般公共预算收入</p>

        <p>10、非税收入占比(本级)=非税收入(本级)*100%/一般公共预算收入(本级)</p>

        <p>11、转移支付收入=一般转移支付收入+专项转移支付收入</p>

        <p>12、转移支付收入(本级)=一般转移支付收入(本级)+专项转移支付收入(本级)</p>

        <p>13、土地出让收入占比=土地出让收入*100%/政府性基金收入</p>

        <p>14、土地出让收入占比(本级)=土地出让收入(本级)*100%/政府性基金收入(本级)</p>

        <p>15、财政赤字率=(一般公共预算支出-一般公共预算收入) *100%/GDP</p>

        <p>16、财政自给率=一般公共预算收入*100%/一般公共预算支出</p>

        <p>17、财政平均收益率=一般公共预算收入*100%/GDP</p>

        <p>18、财政支出弹性系数=一般公共预算支出增速/GDP增速</p>

        <p>
          19、地方政府综合财力=一般公共预算收入＋转移性收入＋政府性基金收入＋国有资本经营预算收入
          <div>
            其中，转移性收入为一般公共预算口径，若综合财力中除一般公共预算收入外的其他3个指标未披露时或部分披露时，未披露的指标以0代替，可能造成综合财力的低估。
          </div>
        </p>

        <p>20、利息支出率=地方政府债券付息额*100%/（政府性基金收入+一般公共预算收入）</p>

        <p>
          21、城投平台有息债务是该地区及辖区行政区划下所有的城投公司的有息债务余额合计，城投平台有息债务(本级)是该地区本级下所有城投公司的有息债务余额合计。部分城投平台因存在控股关系，剔除重复计算部分。数据主要来源于城投平台公司发债的信息披露，若当年数据未披露，则以往年同期数据代替，实际统计中，存在部分城投平台未发债或未公开披露有息债务数据，会造成城投平台有息债务的低估。
          <div>
            城投平台有息债务为各家城投平台短期债务与长期债务之和。其中，短期债务=短期借款+一年内到期的非流动负债+应付短期债券+拆入资金+卖出回购金融资产款+向中央银行借款+吸收存款及同业存放+交易性金融负债，长期债务=长期借款+应付长期债券+长期应付款+租赁负债。
          </div>
        </p>

        <p>22、城投债务率=城投平台有息债务*100%/地方政府综合财力</p>

        <p>23、负债率 = 地方政府债务余额*100%/GDP</p>

        <p>24、负债率(宽口径) = (地方政府债务余额+城投平台有息债务)*100%/GDP</p>

        <p>25、债务率 = 地方政府债务余额*100%/地方政府综合财力</p>

        <p>26、债务率(宽口径) = (地方政府债务余额+城投平台有息债务) *100%/地方政府综合财力</p>

        <p>27、城投平台指标统计范围均包含本地区和下属辖区。</p>

        <div className="declare">
          免责申明：所有数据是大智慧财汇基于公开数据的收集、整理和加工，仅作为参考使用。对本模块有任何意见和建议，请与我们联系，
          线上反馈或拨打客服热线021-20219912
        </div>
      </CommonContent>
    ),
  },
];

const Intro = () => {
  return (
    <HelpUpdateRemind
      leftAnchorList={leftAnchorList}
      updatedVersionDate={'2023-11-18'}
      rightContentList={rightContentList}
      pageCode={'dqdbgj'}
    />
  );
};

export default Intro;
