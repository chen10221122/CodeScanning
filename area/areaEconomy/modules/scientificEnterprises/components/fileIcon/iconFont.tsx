// icon
import { FunctionComponent } from 'react';

import styled from 'styled-components';

import { IconProps } from '@/pages/cloudTotal/typing';

/**
 * date 2020/04/26
 * @param { string } iconType Support：'word' 'pdf' 'txt' 'info'
 * @param { number } height? icon's height
 * @param { number } offset? icon's position on 'Y'
 * @returns { FunctionComponent<IconProps> }
 */

export const Icon: FunctionComponent<IconProps> = ({ iconType }) => {
  const iconfontCode = new Map([
    ['doc', '#iconWORD'],
    ['docx', '#iconWORD'],
    ['pdf', '#iconPDF'],
    ['txt', '#iconTXT'],
    ['xlsx', '#iconEXC'],
    ['xls', '#iconEXC'],
    ['info', '#iconFILE1'],
    ['zlib', '#iconFILE1'],
    ['htmL', '#iconHTML'],
  ]);
  let mapCode = iconfontCode.get(iconType) || iconType;
  return (
    <IconBox>
      <svg className="file_icon" aria-hidden="true">
        <use xlinkHref={mapCode}></use>
      </svg>
    </IconBox>
  );
};

const IconBox = styled.span`
  margin-left: 4px;
  .doc-icon {
    cursor: pointer;
    display: inline-block;
  }
  img {
    object-fit: cover;
    image-rendering: -webkit-optimize-contrast;
  }
  .file_icon {
    width: 14px !important;
    height: 14px !important;
    cursor: pointer;
    vertical-align: -0.23em;
    fill: currentColor;
    overflow: hidden;
    object-fit: cover;
    image-rendering: -webkit-optimize-contrast;
  }
`;
