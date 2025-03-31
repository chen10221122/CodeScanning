import { useRef } from 'react';

import styled from 'styled-components';

import { baseColor } from '@/assets/styles';
import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { dynamicLink, useHistory } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

interface Iprops {
  data: any;
  searchValue: string;
}

export default function MultipleTag({ data, searchValue }: Iprops) {
  const ref = useRef<any>(null);
  const tagRefs = useRef<HTMLSpanElement[]>([]);
  const history = useHistory();
  const textSpanRef = useRef<any>(null);

  return (
    <EnterpriseWrap ref={ref}>
      <span
        ref={textSpanRef}
        className={'pointer'}
        onClick={() => {
          if (data?.code) {
            history.push(
              urlJoin(
                dynamicLink(LINK_DETAIL_ENTERPRISE, {
                  key: '',
                }),
                urlQueriesSerialize({ type: 'company', code: data.code }),
                '#企业速览',
              ),
            );
          }
        }}
      >
        <Content
          dangerouslySetInnerHTML={{
            __html: searchValue ? data?.name.replace(searchValue, `<span class="active">$&</span>`) : data?.name,
          }}
        />
      </span>
      {data.blueTags?.map((item: any) => {
        return (
          <span
            ref={(el) => tagRefs.current.push(el as HTMLSpanElement)}
            className="tag"
            style={{ backgroundColor: '#e9f6fe', color: '#1faef5' }}
          >
            {item}
          </span>
        );
      })}
    </EnterpriseWrap>
  );
}

const Content = styled.span`
  .active {
    color: ${baseColor.redActive};
    em {
      font-style: normal;
    }
  }
`;

const EnterpriseWrap = styled.div`
  overflow: hidden;
  white-space: unset !important;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  &.domChange {
    &:before {
      content: '';
      float: right;
      height: 20px;
    }
  }
  .ellipse {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
  .pointer {
    margin-right: 4px;
    color: #025cdc;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .float {
    float: right;
    clear: both;
  }
  .tagWrap {
    display: inline-block;
    .tag {
      white-space: nowrap;
      height: 18px;
      border-radius: 2px;
      line-height: 18px;
      padding: 3px;
      line-height: 18px;
      font-weight: 400;
      font-size: 12px;
    }
    .tag:not(:last-of-type) {
      margin-right: 4px;
    }
  }
  .tag {
    white-space: nowrap;
    height: 18px;
    border-radius: 2px;
    line-height: 18px;
    padding: 3px;
    line-height: 12px;
    font-weight: 400;
    font-size: 12px;
    display: inline-block;
    margin-bottom: 2px;
  }
  .tag:not(:last-of-type) {
    margin-right: 4px;
  }
`;
