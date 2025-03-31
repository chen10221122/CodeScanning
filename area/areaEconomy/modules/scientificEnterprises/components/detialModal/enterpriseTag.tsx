import { Fragment, memo } from 'react';

import { isEmpty } from 'lodash';
import styled from 'styled-components';

type TCoTagAndName = {
  coTags: string[];
};

enum ETag {
  /** 国有企业 */
  STATE_OENED_ENTERPRISE = '国企',
  /** 沪深京企业 */
  SH_SZ_BJ = '沪深京',
  /** 香港企业 */
  HONG_KONG = '香港',
  /** 发债企业 */
  BOND = '债',
  /** 中央企业 */
  CENTRAL_ENTERPRISE = '央企',
  /** 城投 */
  URBAN_INVERSTMENT_BONDS = '城投',
  /** 新三板 */
  WO_BU_HUI_XIE = '新三板',
}

const styleStrMap = new Map<string, Record<'color' | 'bgColor', string>>([
  [ETag.BOND, { color: '#FE934B', bgColor: '#fff4ed' }],
  [ETag.CENTRAL_ENTERPRISE, { color: '#47BF62', bgColor: '#ECF8EF' }],
  [ETag.HONG_KONG, { color: '#EDB055', bgColor: '#FDF7EE' }],
  [ETag.SH_SZ_BJ, { color: '#23BFB1', bgColor: '#ECFFFD' }],
  [ETag.STATE_OENED_ENTERPRISE, { color: '#5182EA', bgColor: '#F1F2FB' }],
  [ETag.WO_BU_HUI_XIE, { color: '#965EE3', bgColor: '#F6F0FF' }],
  [ETag.URBAN_INVERSTMENT_BONDS, { color: '#FA7171', bgColor: '#FEF0F0' }],
]);

export default memo(({ coTags = ['国企', '深沪京', '香港', '债', '央企'] }: TCoTagAndName) => {
  return (
    <Fragment>
      {coTags && !isEmpty(coTags)
        ? coTags.map((i, idx) => (
            <NameTag tagType={i} coTags={coTags} idx={idx} key={idx}>
              {i}
            </NameTag>
          ))
        : null}
    </Fragment>
  );
});

const NameTag = styled.span<{ tagType: string; coTags: string[]; idx: number }>`
  height: 18px;
  display: inline-block;
  margin-right: ${({ coTags }) => (coTags && coTags.length === 1 ? '0' : '4px')};
  margin-left: ${({ idx }) => (idx ? '0' : '4px')};
  line-height: 18px;
  font-size: 12px;
  font-weight: 400;
  padding: 0 3px;
  border-radius: 2px;
  ${({ tagType }) => styleStrConstructor(tagType)}
`;

const styleStrConstructor = (type: string) => {
  const colorObj = styleStrMap.get(type) || { color: '#434343', bgColor: 'gray' };
  return `
    color: ${colorObj!.color};
    background-color: ${colorObj!.bgColor};
  `;
};
