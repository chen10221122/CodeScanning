export default {
  cityCode: '', //	 市级代码筛选,多个逗号隔开
  companyType: '', //	 企业类型筛选:a-央企,b-国企,c-沪深京上市,d-香港上市,e-新三板,f-发债人,g-城投企业
  competency: '', //	 资格卡片名称筛选(多个用逗号隔开):1：国家级,2：省级
  countryCode: '', //	 区县代码筛选,多个逗号隔开
  declareDate: '', //	 公告时间(区间查询, [startDate,endDate])区间筛选:左右开-();左右闭-[];区间值逗号隔开;不取值的区间值留空,多个区间分号隔开,例如:(min,max];(min,]
  establishmentTime: '', //	 成立时间(区间查询, [startDate,endDate])区间筛选:左右开-();左右闭-[];区间值逗号隔开;不取值的区间值留空,多个区间分号隔开,例如:(min,max];(min,]
  industryCodeLevel1: '', //	 行业一级分类代码筛选,多个逗号隔开
  industryCodeLevel2: '', //	 行业二级分类代码筛选,多个逗号隔开
  industryCodeLevel3: '', //	 行业三级分类代码筛选,多个逗号隔开
  industryCodeLevel4: '', //	 行业四级分类代码筛选,多个逗号隔开
  itCode2: '', //	 企业代码2筛选,多个逗号隔开
  itName: '', //	 企业名称模糊筛选
  pageSize: '', //	每页大小
  provinceCode: '', //	省份代码筛选,多个逗号隔开
  registeredCapital: '', //	注册资金(单位-元，区间查询, [min,max])区间筛选:左右开-();左右闭-[];区间值逗号隔开;不取值的区间值留空,多个区间分号隔开,例如:(min,max];(min,]
  skip: '', //	起始index
  sortKey: '', //	排序字段:ITName-企业名称;DeclareDate-公告日期;CR0001_004-法定代表人;companyTypeCode-上市/发债(特殊处理代码);CR0001_002-成立日期;CR0001_005_yuan-注册资本(统一单位元);otherTagCodesCount-其他称号数量
  sortRule: '', //	排序规则:desc/asc
  statisticType: '', //	统计方式: 1-资格卡片统计;2-地区分布;3-行业分布(国标行业一级)
  tagCode: '', //	标签代码筛选,多个逗号隔开
  tagCode2: '', //	被撤销页面查询传参 固定传参->TAG218,TAG2121,TAG5345,TAG687,TAG130019,TAG6193,TAG720
  techType: '', //	必填 榜单类型:1-未撤销;2-已撤销
};
