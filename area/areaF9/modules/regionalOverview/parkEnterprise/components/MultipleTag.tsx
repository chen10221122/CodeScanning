import { useRef, useState } from 'react';

import { useDebounceEffect, useSize } from 'ahooks';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import { baseColor } from '@/assets/styles';
import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import type { TableData } from '@/pages/area/areaF9/modules/regionalOverview/industrialPark/modules/modal/type';
import { dynamicLink, useHistory } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';

interface Iprops {
  data: TableData;
  searchValue: string | undefined;
}

export default function MultipleTag({ data, searchValue }: Iprops) {
  const ref = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<HTMLSpanElement[]>([]);
  const history = useHistory();
  const [change, setChange] = useState(false); // dom结构是否改变
  const { width } = useSize(ref) || {};
  const textSpanRef = useRef<HTMLSpanElement>(null);

  useDebounceEffect(
    () => {
      // 通过计算文本区域的offsetHeight来判断是否需要文本溢出效果（文本区域的clientHeight为0,应被其他样式影响）
      // 监听EnterpriseWrap的scrollHeight不准确，会存在实际文本只有一行但是标签两行导致添加了文本溢出的样式
      if (textSpanRef.current) {
        if (textSpanRef.current?.offsetHeight > 35) {
          setChange(true);
        } else {
          setChange(false);
        }
      }
    },
    [width],
    { wait: 150 },
  );

  return (
    <EnterpriseWrap ref={ref} className={classNames({ domChange: change })}>
      <span
        ref={textSpanRef}
        className={classNames({ ellipse: change }, 'pointer')}
        title={change ? data?.companyName : undefined}
        onClick={() => {
          if (data?.itCode2) {
            history.push(
              urlJoin(
                dynamicLink(LINK_DETAIL_ENTERPRISE, {
                  key: '',
                }),
                urlQueriesSerialize({ type: 'company', code: data.itCode2 }),
                '#企业速览',
              ),
            );
          }
        }}
      >
        <Content
          dangerouslySetInnerHTML={{
            __html: searchValue
              ? data?.companyName.replace(searchValue, `<span class="active">$&</span>`)
              : data?.companyName,
          }}
        />
      </span>
      {!isEmpty(data.tags)
        ? data.tags.map((item) => {
            return (
              <span
                ref={(el) => tagRefs.current.push(el as HTMLSpanElement)}
                className="tag"
                style={{ backgroundColor: item.backGroundColor, color: item.color }}
              >
                {item.name}
              </span>
            );
          })
        : null}
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
  white-space: break-spaces !important;
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
    -webkit-line-clamp: 2;
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
