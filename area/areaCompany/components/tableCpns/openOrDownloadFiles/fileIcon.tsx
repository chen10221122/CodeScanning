import { FunctionComponent } from 'react';

import styled from 'styled-components';

import { IconProps } from '@/pages/cloudTotal/typing';

/**
 * @param { string } iconType Support：'word' 'pdf' 'txt' 'info'
 * @param { number } height? icon's height
 * @param { number } offset? icon's position on 'Y'
 * @returns { FunctionComponent<IconProps> }
 */

export const Icon: FunctionComponent<IconProps> = ({ iconType, height }) => {
  const iconfontCode = new Map([
    ['doc', '#iconWORD'],
    ['docx', '#iconWORD'],
    ['pdf', '#iconPDF'],
    ['txt', '#iconTXT'],
    ['xlsx', '#iconEXC'],
    ['xls', '#iconEXC'],
    ['info', '#iconFILE1'],
    ['csv', '#iconFILE1'],
    ['zlib', '#iconFILE1'],
    ['htmL', '#iconHTML'],
    ['zip', '#iconZIP'],
    ['rar', '#iconZIP'],
    ['jpg', '#icona-icon_jpg_normal2x2x'],
    ['png', '#icona-icon_png_normal2x2x'],
    ['jpeg', '#icona-icon_jpg_normal2x2x'],
  ]);
  let mapCode = iconfontCode.get(iconType) || '#iconFILE1' || iconType;
  return (
    <IconBox height={height}>
      <svg className="icon" aria-hidden="true">
        <use xlinkHref={mapCode}></use>
      </svg>
    </IconBox>
  );
};

const IconBox = styled.span<{ height?: number }>`
  .doc-icon {
    cursor: pointer;
    display: inline-block;
  }
  img {
    object-fit: cover;
    image-rendering: -webkit-optimize-contrast;
  }
  .icon {
    ${({ height }) =>
      height
        ? `
        width: ${height}px;  
        height: ${height}px;
      `
        : ''}
    cursor: pointer;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    object-fit: cover;
    image-rendering: -webkit-optimize-contrast;
  }
`;
