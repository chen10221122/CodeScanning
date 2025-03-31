import { FC, memo, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Popover } from '@dzh/components';
import { useMemoizedFn, useRequest } from 'ahooks';
import styled from 'styled-components';

import { getAreaRiskLevel } from '@/apis/area/areaEconomy';
import { LINK_INFORMATION_TRACE } from '@/configs/routerMap';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

import { Props, DataType, styleMap } from './const';

const RiskLevel: FC<Props> = ({ code, getPopupContainer }) => {
  const history = useHistory();
  const [data, setData] = useState<DataType | null>(null);
  /**获取风险等级数据 */
  const { run } = useRequest(getAreaRiskLevel, {
    manual: true,
    onSuccess: (res) => {
      if (res?.data && res?.data?.riskLevel) {
        setData(res.data);
      } else {
        setData(null);
      }
    },
    onError: () => {
      setData(null);
    },
  });
  /**拆分riskLevelDetail，拿到颜色*/
  const [prefix, riskColor, final] = useMemo(() => {
    const match = data?.riskLevelDetail?.match(/(.*?为)(.*?)([。]?)$/);
    return [match?.[1]?.trim() || '', match?.[2]?.trim() || '', match?.[3]?.trim() || ''];
  }, [data?.riskLevelDetail]);

  const { borderColor, textColor, arrow, arrowHover } = data?.riskLevel ? styleMap[data?.riskLevel] : styleMap['108'];

  useEffect(() => {
    code && run({ regionCode: code });
  }, [code, run]);

  /** 跳转溯源页 */
  const goToTrancePage = useMemoizedFn((guid: any) => {
    if (guid) {
      history.push(
        urlJoin(
          LINK_INFORMATION_TRACE,
          urlQueriesSerialize({
            guId: guid,
          }),
        ),
      );
    } else return;
  });

  const popContent = useMemo(() => {
    return (
      <ContentContainer color={textColor}>
        <div className="risk">
          {prefix}
          <span className="risk-color">{riskColor}</span>
          {final}
        </div>
        <div className="text">
          <span className="text-source">原文摘要：</span>
          <span className="text-trance" onClick={() => goToTrancePage(data?.guid)}>
            {data?.originalSummary}
          </span>
        </div>
      </ContentContainer>
    );
  }, [data?.guid, data?.originalSummary, final, goToTrancePage, prefix, riskColor, textColor]);

  return data ? (
    <Container textColor={textColor} borderColor={borderColor} arrow={arrow} arrowHover={arrowHover}>
      <Popover
        content={popContent}
        getPopupContainer={getPopupContainer}
        placement="bottomLeft"
        overlayClassName="risk-level-popover"
        limitContent={false}
      >
        <div className="risk-level">
          <span className="risk-left"> 风险等级:</span>
          {riskColor}
          <span className="img" />
        </div>
      </Popover>
    </Container>
  ) : null;
};

export default memo(RiskLevel);

const Container = styled.div<{ textColor: string; borderColor: string; arrow: string; arrowHover: string }>`
  .risk-level {
    margin-left: 6px;
    display: flex;
    align-items: center;
    width: 108px;
    height: 20px;
    border: 1px solid ${({ borderColor }) => borderColor};
    border-radius: 2px;
    color: ${({ textColor }) => textColor};
    font-size: 12px;
    font-family: PingFang SC, PingFang SC-Regular;
    text-align: left;
    line-height: 18px;
    white-space: nowrap;
    .risk-left {
      margin: 1px 8px 1px 6px;
    }
    .img {
      width: 10px;
      height: 10px;
      background-image: url(${({ arrow }) => arrow});
      background-size: 10px;
      margin: 4px 5px 4px 2px;
    }
    &:hover {
      cursor: pointer;
      .img {
        background-image: url(${({ arrowHover }) => arrowHover});
      }
    }
  }
`;

const ContentContainer = styled.div<{ color: string }>`
  width: 489px;
  font-size: 12px;
  color: #262626;
  margin: 0 8px;
  .risk {
    margin-top: 1px;
    line-height: 24px;
    .risk-color {
      color: ${({ color }) => color};
    }
  }
  .text {
    margin-top: 6px;
    line-height: 20px;
    .text-source {
      font-weight: 800;
    }
    .text-trance {
      &:hover {
        color: #0171f6;
        cursor: pointer;
      }
    }
  }
`;
