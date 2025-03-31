import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useRequest } from 'ahooks';

import { getLandMainDetail } from '@pages/area/landTopic/api';
import Tooltip from '@pages/area/landTopic/components/tooltip';

import { LINK_AREA_F9, LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

const HIGH_COLOR = '#fe3a2f';
const DEFAULT_COLOR = '#141414';

const DEFAULT = {
  basicInfo: {},
  contractInfo: {},
  landTradeInfo: {},
};

const useData = (mainCode: string, landCode: string) => {
  const history = useHistory();
  const [data, setData] =
    useState<Record<'basicInfo' | 'contractInfo' | 'landTradeInfo', Record<string, any>>>(DEFAULT);
  const [guid, setGuid] = useState('');

  const { loading } = useRequest(getLandMainDetail, {
    onSuccess: ({ data: res }) => {
      const { basicInfo, contractInfo, landTradeInfo, guid: curGuid } = res;
      setData({
        basicInfo: basicInfo || {},
        contractInfo: contractInfo || {},
        landTradeInfo: landTradeInfo || {},
      });
      setGuid(curGuid || '');
    },
    defaultParams: [mainCode, landCode],
    onError: () => {
      setData({ ...DEFAULT });
      setGuid('');
    },
    ready: !!mainCode,
  });

  const basicInfo = useMemo(() => {
    const res = data.basicInfo;
    return [
      [
        {
          key: '行政区',
          title: '行政区',
          content: (
            <span
              onClick={() => {
                res.regionCode &&
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_AREA_F9, { key: 'regionEconomy', code: res.regionCode }),
                      urlQueriesSerialize({
                        code: res.regionCode,
                      }),
                    ),
                  );
              }}
              className={res.regionCode ? 'link' : ''}
            >
              {res.region || '-'}
            </span>
          ),
        },
        {
          key: '供应方式',
          title: '供应方式',
          content: res.supplyMode || '-',
        },
        {
          key: '土地坐落',
          title: '土地坐落',
          content: res.landLocation || '-',
        },
      ],
      [
        {
          key: '土地用途',
          title: '土地用途',
          content: res.landUsage || '-',
        },
        {
          key: '出让年限',
          title: '出让年限',
          content: res.transferPeriod || '-',
        },
        {
          key: '土地级别',
          title: '土地级别',
          content: res.landLevel || '-',
        },
      ],
      [
        {
          key: '用地面积(㎡)',
          title: '用地面积(㎡)',
          content: res.landArea || '-',
          titleStyle: { color: HIGH_COLOR },
          contentStyle: { color: res.landArea ? HIGH_COLOR : DEFAULT_COLOR },
        },
        {
          key: '规划建筑面积(㎡)',
          title: '规划建筑面积(㎡)',
          content: res.buildingArea || '-',
        },
        {
          key: '容积率',
          title: '容积率',
          content: res.plotRatio || '-',
        },
      ],
      [
        {
          key: '绿化率',
          title: '绿化率',
          content: res.greeningRate || '-',
        },
        {
          key: '建筑密度',
          title: '建筑密度',
          content: res.buildingDensity || '-',
        },
        {
          key: '建筑限高',
          title: '建筑限高',
          content: res.buildingHeightLimit || '-',
        },
      ],
    ];
  }, [data.basicInfo, history]);

  const tradingInfo = useMemo(() => {
    const res = data.landTradeInfo;
    return [
      [
        {
          key: '招拍挂起始时间',
          title: '招拍挂起始时间',
          content: res.startDate || '-',
        },
        {
          key: '招拍挂截止时间',
          title: '招拍挂截止时间',
          content: res.endDate || '-',
        },
        {
          key: '起始价(万元)',
          title: '起始价(万元)',
          content: res.startPrice || '-',
        },
      ],
      [
        {
          key: '报名起始时间',
          title: '报名起始时间',
          content: res.signUpStartDate || '-',
        },
        {
          key: '报名截止时间',
          title: '报名截止时间',
          content: res.signUpEndDate || '-',
        },
        {
          key: '成交价(万元)',
          title: '成交价(万元)',
          content: res.dealPrice || '-',
        },
      ],
      [
        {
          key: '成交楼面价(元/㎡)',
          title: (
            <>
              成交楼面价(元/㎡)
              <Tooltip title="成交楼面价 = 成交价*100/规划建筑面积" innerStyle={{ marginLeft: 0 }} />
            </>
          ),
          content: res.dealFloorPrice || '-',
          titleStyle: { color: HIGH_COLOR },
          contentStyle: { color: res.dealFloorPrice ? HIGH_COLOR : DEFAULT_COLOR },
        },
        {
          key: '起始楼面价(元/㎡)',
          title: (
            <>
              起始楼面价(元/㎡)
              <Tooltip title="起始楼面价 = 土地起始价*100/规划建筑面积" innerStyle={{ marginLeft: 0 }} />
            </>
          ),
          content: res.startFloorPrice || '-',
          titleStyle: { color: HIGH_COLOR },
          contentStyle: { color: res.startFloorPrice ? HIGH_COLOR : DEFAULT_COLOR },
        },
        {
          key: '溢价率(%)',
          title: (
            <>
              溢价率(%)
              <Tooltip title="溢价率 = (成交价-起拍价)*100/起拍价" />
            </>
          ),
          content: res.averagePremiumRate || '-',
          titleStyle: { color: HIGH_COLOR },
          contentStyle: { color: res.averagePremiumRate ? HIGH_COLOR : DEFAULT_COLOR },
        },
      ],
      [
        {
          key: '受让人',
          title: '受让人',
          content: (
            <span
              onClick={() => {
                res.assigneeCode &&
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                      urlQueriesSerialize({
                        code: res.assigneeCode,
                        type: 'company',
                      }),
                    ),
                  );
              }}
              className={res.assigneeCode ? 'link' : ''}
            >
              {res.assignee || '-'}
            </span>
          ),
        },
        {
          key: '成交公示日期',
          title: '成交公示日期',
          content:
            res.dealAnnouncementDateEnd || res.dealAnnouncementDateStart
              ? `${res.dealAnnouncementDateStart || '-'}至${res.dealAnnouncementDateEnd || '-'}`
              : '-',
        },
        {
          key: '加价幅度(万元)',
          title: '加价幅度(万元)',
          content: res.priceIncrement || '-',
        },
      ],
      [
        {
          key: '竞买保证金(万元)',
          title: '竞买保证金(万元)',
          content: res.biddingDeposit || '-',
        },
        {
          key: '投资强度',
          title: '投资强度',
          content: res.investIntensity || '-',
          colspan: 2,
        },
      ],
    ];
  }, [data.landTradeInfo, history]);

  const contractInfo = useMemo(() => {
    const res = data.contractInfo;
    return [
      [
        {
          key: '合同签订日期',
          title: '合同签订日期',
          content: res.contractSignDate || '-',
        },
        {
          key: '项目名称',
          title: '项目名称',
          content: res.projectName || '',
        },
        {
          key: '合同编号',
          title: '合同编号',
          content: res.contractNumber || '-',
        },
      ],
      [
        {
          key: '土地使用权人',
          title: '土地使用权人',
          content:
            res.landUserCode !== 'null' ? (
              <span
                onClick={() => {
                  res.landUserCode &&
                    history.push(
                      urlJoin(
                        dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                        urlQueriesSerialize({
                          code: res.landUserCode,
                          type: 'company',
                        }),
                      ),
                    );
                }}
                className={res.landUser ? 'link' : ''}
              >
                {res.landUser || '-'}
              </span>
            ) : (
              <span>{res.landUser || '-'}</span>
            ),
        },
        {
          key: '行业分类',
          title: '行业分类',
          content: res.industryClassify || '-',
        },
        {
          key: '电子监管号',
          title: '电子监管号',
          content: res.electronicSupervisionNumber || '-',
        },
      ],
      [
        {
          key: '约定交地时间',
          title: '约定交地时间',
          content: res.appointPayDate || '-',
        },
        {
          key: '约定容积率',
          title: '约定容积率',
          content: res.appointPlotRatio || '-',
        },
        {
          key: '约定竣工时间',
          title: '约定竣工时间',
          content: res.appointFinishedDate || '-',
        },
      ],
      [
        {
          key: '约定开工时间',
          title: '约定开工时间',
          content: res.appointStartDate || '-',
        },
        {
          key: '计划开发周期(年)',
          title: '计划开发周期(年)',
          content: res.planDevelopPeriod || '-',
          colspan: 2,
          titleStyle: { color: HIGH_COLOR },
          contentStyle: { color: res.planDevelopPeriod ? HIGH_COLOR : DEFAULT_COLOR },
        },
      ],
    ];
  }, [data.contractInfo, history]);

  return { loading, basicInfo, tradingInfo, contractInfo, guid };
};

export default useData;
