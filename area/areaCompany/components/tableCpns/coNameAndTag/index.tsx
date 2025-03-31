import { useCreation, useMemoizedFn } from 'ahooks';
import { isArray } from 'lodash';
import styled from 'styled-components';

import { highlight } from '@/utils/dom';

import { NormalLink } from '../linkToF9';

interface ICoNameAndTags {
  code: string;
  name: string;
  tag: string[];
  limitWordCount?: number;
  /** 租赁融资特殊处理 */
  isFinancing?: boolean;
  /** 搜索高亮 */
  keyword?: string;
  /** 需要的标签 */
  standaryTagList?: string[];
}

// 租赁融资沿用之前的颜色样式
const getFinancingStyleValue = (key: string) => {
  switch (key) {
    case '上市':
    case '央企':
    case '国企':
    case '央企子公司':
    case '民企':
    case '发债':
    case '城投子公司':
    case '城投':
      return {
        color: '#1FAEF5',
        bg: '#E9F6FE',
      };
    case '高新技术企业':
    case '科技型中小企业':
    case '专精特新小巨人':
    case '专精特新中小企业':
      return {
        color: '#ff7500',
        bg: '#FFF4EB',
        lineHeight: '16px',
      };
    default:
      return {};
  }
};

const style_map = new Map<string, Record<'color' | 'bg', string>>([
  /** listed type */
  ['沪主板', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['创业板', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['主板', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['北交所', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['科创板', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['新三板', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['港股', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['中概股', { color: '#1FAEF5', bg: '#E9F6FE' }],
  /** type */
  ['央企子公司', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['央企', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['国企', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['民企', { color: '#1FAEF5', bg: '#E9F6FE' }],
  /** bond */
  ['城投子公司', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['城投', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['发债', { color: '#1FAEF5', bg: '#E9F6FE' }],
  ['上市', { color: '#1FAEF5', bg: '#E9F6FE' }],
  /** co status */
  ['在营', { color: '#78BC6F', bg: '#EFF7EE' }],
  ['迁出', { color: '#78BC6F', bg: '#EFF7EE' }],

  ['撤销', { color: '#EDB055', bg: '#FDF7EE' }],
  ['停业', { color: '#EDB055', bg: '#FDF7EE' }],

  ['注销', { color: '#FB7171', bg: '#FFF4F4' }],
  ['吊销', { color: '#FB7171', bg: '#FFF4F4' }],
  ['吊销,已注销', { color: '#FB7171', bg: '#FFF4F4' }],

  ['辅导期', { color: '#FF7500', bg: '#FFF3EA' }],
  ['申报期', { color: '#FF7500', bg: '#FFF3EA' }],
  ['待上市', { color: '#FF7500', bg: '#FFF3EA' }],
  ['已上市', { color: '#FF7500', bg: '#FFF3EA' }],
]);

export const CoNameAndTags = ({
  code,
  name,
  tag,
  limitWordCount,
  isFinancing,
  keyword,
  standaryTagList,
}: ICoNameAndTags) => {
  const limit = limitWordCount ?? 32;

  const _tag = useCreation(() => {
    if (standaryTagList) {
      return tag?.filter((i) => standaryTagList?.includes(i));
    } else {
      return tag;
    }
  }, [standaryTagList, tag]);
  const buildNode = useMemoizedFn((name: string) => {
    if (name) {
      const styleInfo = isFinancing ? getFinancingStyleValue(name) : style_map.get(name);
      return (
        <TagItem {...styleInfo} style={{ marginRight: '4px' }}>
          {name}
        </TagItem>
      );
    } else {
      return <></>;
    }
  });

  const tags = useCreation(() => {
    if (tag && isArray(tag)) {
      return <>{_tag.map(buildNode)}</>;
    }
  }, [tag]);

  if (name) {
    if (name.length < limit) {
      return (
        <>
          <CoName code={code} style={{ marginRight: tag?.length ? '4px' : '0px' }} title={name}>
            <NormalLink type="company" code={code}>
              {highlight(name, keyword)}
            </NormalLink>
          </CoName>
          {tags}
        </>
      );
    } else {
      return (
        <>
          <OverflowWordCount>
            <CoName code={code} title={name}>
              <NormalLink type="company" code={code}>
                {highlight(name, keyword)}
              </NormalLink>
            </CoName>
          </OverflowWordCount>
          {tags}
        </>
      );
    }
  } else {
    return <>-</>;
  }
};

export const NormalWordCount = styled.div<{ code?: string }>``;
export const OverflowWordCount = styled.div<{ code?: string }>`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CoName = styled.span<{ code?: string }>`
  font-size: 13px;
  color: ${(props) => (props?.code ? '#025CDC' : '#141414')};
  line-height: 20px;
  cursor: pointer;
  &:hover {
    text-decoration: ${(props) => (props?.code ? 'underline' : 'none')};
  }
`;

const TagItem = styled.span<{ color?: string; bg?: string; border?: string; lineHeight?: string }>`
  display: inline-block;
  height: 18px;
  line-height: 18px;
  font-size: 12px;
  border-radius: 2px;
  padding: 0 4px 0;
  ${({ color, bg, border, lineHeight }) => {
    return `
      color: ${color ?? '#1FAEF5'};
      background-color: ${bg ?? ''};
      border: ${border ?? ''};
      line-height: ${lineHeight ?? ''};
    `;
  }}
`;
