import { memo } from 'react';

import styled from 'styled-components';

import { baseColor } from '@/assets/styles';

import LevelTag from './levelTag';
interface Props {
  name?: string;
  tag?: string;
  keywords?: string;
  external?: JSX.Element | null;
}

// 搜索飘红，无数据展示-
export const Title = ({ content, keywords }: { content: string; keywords?: string }) => {
  return keywords ? (
    <>
      <Content
        dangerouslySetInnerHTML={{
          __html: content.replace(keywords, `<span class="active">$&</span>`),
        }}
      />
    </>
  ) : (
    <span>{content}</span>
  );
};

/* 园区名称 */
const Company = ({ name, tag, keywords, external }: Props) => {
  return (
    <Wrapper>
      <NameWrapper>
        <span className="normalCompany" title={name}>
          {name ? <Title content={name} keywords={keywords} /> : '-'}
        </span>
        {tag ? <LevelTag tag={tag} /> : null}
      </NameWrapper>
      {external}
    </Wrapper>
  );
};

export default memo(Company);

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  white-space: unset !important;
  .external {
    margin-left: 6px;
  }
`;

const NameWrapper = styled.div`
  width: 100%;
  display: flex;
  .normalCompany {
    margin-right: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
`;

const Content = styled.span`
  .active {
    color: ${baseColor.redActive};
    em {
      font-style: normal;
    }
  }
`;
