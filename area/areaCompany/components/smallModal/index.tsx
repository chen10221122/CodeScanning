import { ReactNode, FC, memo } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import { isUndefined } from 'lodash';
import styled from 'styled-components';

import { Empty, Modal } from '@/components/antd';
import Spin from '@/components/antd/spin';
import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import ArrowBg from '@/pages/area/areaCompany/assets/ratio_bottom_arrow.svg';
import { dynamicLink, useHistory } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

interface Props {
  title: string;
  data: {
    contentTitle: {
      bigCompanyName: string;
      smallCompanyName: string;
      ratio: string;
    };
    content: Record<string, any>[];
  };
  visible: boolean;
  setVisible: Function;
  loading: boolean;
  container?: ReactNode;
}

/** 具体展示逻辑参考这个文件src\pages\detail\modules\enterprise\overview\modules\actualControllerNew\components\AllControlPath.js */

const SmallModal: FC<Props> = ({
  title,
  data,
  visible,
  setVisible,
  loading,
  container = document.getElementById('area-company-index-container'),
}) => {
  const history = useHistory();

  const linkToCompany = useMemoizedFn((code) => {
    if (code) {
      history.push(
        urlJoin(
          dynamicLink(LINK_DETAIL_ENTERPRISE, {
            key: '',
          }),
          urlQueriesSerialize({ type: 'company', code }),
        ),
      );
    }
  });

  return (
    <Modal
      title={title}
      type="f9Modal"
      modalWidth={680}
      width={680}
      visible={visible}
      bodyStyle={{ padding: 0 }}
      onCancel={() => {
        setVisible(false);
      }}
      getContainer={() => container || document.body}
      contentStyle={{
        padding: '16px 4px 20px 0',
        minHeight: '418px',
      }}
    >
      {loading ? (
        <>
          <div style={{ height: 128 }}></div>
          <Spin type="thunder" />
        </>
      ) : data && data.content && data.content.length ? (
        <InnerContent>
          <div className="innerContentTitle">
            <span>{data.contentTitle.bigCompanyName || ''}</span>
            {data.contentTitle.ratio && !isUndefined(data.contentTitle.ratio) ? (
              <ContentArrow>{data.contentTitle.ratio}</ContentArrow>
            ) : null}
            <span>{data.contentTitle.smallCompanyName || ''}</span>
          </div>
          {data.content.length
            ? data.content.map((item, idx) => {
                const { name, percent } = item;
                return (
                  <div className="innerContentDetail" key={idx}>
                    <span className="innerContentDetailTitle">控制路径{idx + 1}：</span>
                    <span className="innerContentDetailContext">
                      {Array.isArray(name) && name[0]
                        ? name.map((nameItem, nameI) => {
                            const [company, code] = nameItem.split('@');
                            const precent = percent[nameI];
                            return (
                              <span key={nameI}>
                                <span
                                  className={cn('innerContentDetailText', { innerContentDetailLinkText: code })}
                                  onClick={() => linkToCompany(code)}
                                >
                                  {company}
                                </span>
                                {precent && !isUndefined(precent) ? (
                                  <ContentArrow>
                                    {parseFloat(percent[nameI]?.split('%')[0]) === 0 ? '-' : percent[nameI]}
                                  </ContentArrow>
                                ) : null}
                              </span>
                            );
                          })
                        : null}
                    </span>
                  </div>
                );
              })
            : null}
        </InnerContent>
      ) : (
        <Empty type={Empty.NO_DATA_NEW_MODAL} style={{ marginTop: 98 }} />
      )}
    </Modal>
  );
};

export default memo(SmallModal);

const InnerContent = styled.div`
  height: 382px;
  overflow: overlay;
  padding: 0 20px;
  .innerContentTitle {
    font-size: 14px;
    color: #141414;
    line-height: 21px;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .innerContentDetail {
    font-size: 13px;
    line-height: 20px;
    margin-top: 12px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    .innerContentDetailTitle {
      flex-shrink: 0;
      display: inline-block;
      height: 20px;
      color: #595959;
      margin-right: 8px;
    }
    .innerContentDetailContext {
      .innerContentDetailText {
        display: inline-block;
        height: 20px;
        color: #262626;
      }
      .innerContentDetailLinkText {
        cursor: pointer;
        color: #025cdc;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  ::-webkit-scrollbar {
    display: none;
  }
  &:hover {
    ::-webkit-scrollbar {
      display: block;
    }
  }
`;
const ContentArrow = styled.span`
  display: inline-block;
  width: 50px;
  height: 20px;
  margin: 0 6px;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: #ff7500;
  line-height: 20px;
  text-align: center;
  position: relative;
  /* 中文不支持小于12px的字体 这里用scale缩小一下 */
  transform: translateY(-4px) scale(0.9);
  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    content: '';
    width: 50px;
    height: 4px;
    background-image: url(${ArrowBg});
  }
`;
