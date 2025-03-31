// 属地银行主要指标
export const ColumnConfig = [
  {
    title: '总资产(亿元)',
    dataIndex: 'totalAsset',
  },
  {
    title: '贷款规模(亿元)',
    dataIndex: 'loanScale',
  },
  {
    title: '贷款增速(%)',
    dataIndex: 'loanGrowthRate',
  },
  {
    title: '金融投资规模(亿元)',
    dataIndex: 'finInvestmentScale',
    prompt: true,
    popName: 'creditLine',
    content:
      '金融投资规模=交易性金融资产+可供出售金融资产+以摊余成本计量的金融资产+以公允价值计量且其变动计入其他综合收益的金融资产+持有至到期投资+其他债权投资+其他权益工具投资',
  },
  {
    title: '总负债(亿元)',
    dataIndex: 'totalDebt',
  },
  {
    title: '存款规模(亿元)',
    dataIndex: 'depositScale',
  },
  {
    title: '存款增速(%)',
    dataIndex: 'depositGrowthRate',
  },
  {
    title: '同业负债(亿元)',
    dataIndex: 'interbankDebt',
    prompt: true,
    popName: 'interbankDebt',
    content: '同业负债=同业存拆入+卖出回购金融资产款',
  },
  {
    title: '利息收入(亿元)',
    dataIndex: 'interestIncome',
  },
  {
    title: '净利润(亿元)',
    dataIndex: 'retainedProfit',
  },
  {
    title: 'ROA(%)',
    dataIndex: 'roa',
  },
  {
    title: 'ROE(%)',
    dataIndex: 'roe',
  },
  {
    title: '净息差(%)',
    dataIndex: 'netXiMargin',
  },
  {
    title: '净利差(%)',
    dataIndex: 'netLiMargin',
  },
  {
    title: '不良贷款余额(亿元)',
    dataIndex: 'nonPerformBalance',
  },
  {
    title: '资本充足率(%)',
    dataIndex: 'capitalAmpleRate',
  },
  {
    title: '不良贷款率(%)',
    dataIndex: 'nonPerformLoansRate',
  },
  {
    title: '不良贷款增速(%)',
    dataIndex: 'nonPerformLoansGrowthRate',
  },
  {
    title: '拨备覆盖率(%)',
    dataIndex: 'provisionCoverage',
  },
  {
    title: '资本净额(亿元)',
    dataIndex: 'netCapital',
  },
  {
    title: '核心一级资本充足率(%)',
    dataIndex: 'coreOneCapitalAmpleRate',
  },
  {
    title: '一级资本充足率(%)',
    dataIndex: 'oneCapitalAmpleRate',
  },
  {
    title: '流动性比率(%)',
    dataIndex: 'currentRatio',
  },
  {
    title: '存贷比(%)',
    dataIndex: 'loanDebtRate',
  },
  {
    title: '单一最大客户贷款比例(%)',
    dataIndex: 'singleMaxDebtRate',
  },
  {
    title: '最大十家客户贷款占资本净额比例(%)',
    dataIndex: 'topTenCapitalRate',
  },
  {
    title: '杠杆率(%)',
    dataIndex: 'leverRate',
  },
];

export const defaultColumnKey = [
  'totalAsset',
  'retainedProfit',
  'capitalAmpleRate',
  'nonPerformLoansRate',
  'loanDebtRate',
];
