import { FC, useRef } from 'react';

import { useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { OVERVIEW } from '@/pages/detail/enterprise/config/pathConfig';
import { highlight } from '@/utils/dom';
import { dynamicLink, useHistory } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

interface Props {
  code?: string;
  name?: string;
  tag?: any[];
  type?: string;
  keyWord?: string;
  maxWidth?: number;
  external?: JSX.Element;
  showExternal?: boolean;
}

const market = ['SH', 'SZ', 'BJ', 'HK', 'NQ'];

const positiveName = [
  '高新技术企业',
  '专精特新“小巨人”',
  '专精特新中小企业',
  '创新型中小企业',
  '科技部科技型中小企业',
  '国家级企业技术中心',
  '省级企业技术中心',
  '专精特新“小巨人”企业',
];

const styleMap: Record<string, { color: string; background: string }> = {
  上市: {
    color: '#1FAEF5',
    background: '#E9F6FE',
  },
  发债: {
    color: '#1FAEF5',
    background: '#E9F6FE',
  },
  正面: {
    color: '#FF7500',
    background: '#FFF4EB',
  },
};

const generateStyle = (status: string) => {
  if (positiveName.includes(status)) return styleMap['正面'];
  if (market.some((suffix) => status.endsWith(suffix))) return styleMap['上市'];
  return styleMap[status] || styleMap['上市'];
};

const Index: FC<Props> = ({ code, name, tag, type = 'company', keyWord, maxWidth, external, showExternal = true }) => {
  const history = useHistory();
  const domRef = useRef<any>(null);

  const handlerCompanyNameClick = useMemoizedFn((code: string, type?: string) => {
    history.push(urlJoin(dynamicLink(LINK_DETAIL_ENTERPRISE, { key: OVERVIEW }), urlQueriesSerialize({ type, code })));
  });

  return (
    <Wrapper>
      <NameWrapper>
        <div
          ref={domRef}
          className={cn({ 'primary-link': code }, 'normal-company')}
          onClick={() => {
            if (code) {
              handlerCompanyNameClick(code, type);
            }
          }}
          title={name}
        >
          {keyWord ? highlight(name || '-', keyWord) : name}
        </div>
        {showExternal
          ? tag?.map((item, index) => (
              <Tag style={generateStyle(item)} key={index} className="tag">
                {item}
              </Tag>
            ))
          : null}
      </NameWrapper>
      {external}
    </Wrapper>
  );
};

export default Index;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  white-space: unset !important;
  .external {
    width: 18px;
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
  }
`;

const NameWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  .normal-company {
    margin-right: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const Tag = styled.span`
  margin-right: 4px;
  margin-top: 1px;
  display: inline-block;
  padding: 0 4px;
  border-radius: 2px;
  background: #e8f6fe;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  font-weight: 400;
  color: #20aef5;
  text-align: center;
  box-sizing: border-box;
  white-space: nowrap;
`;
