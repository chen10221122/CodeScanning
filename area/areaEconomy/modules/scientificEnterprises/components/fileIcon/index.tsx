import { FunctionComponent } from 'react';

import styled from 'styled-components';

import info from '@/pages/cloudTotal/image/info@2x.svg';
import exc from '@/pages/cloudTotal/image/tableIcon/icon_excl_normal@2x.png';
import zlibOrHtml from '@/pages/cloudTotal/image/tableIcon/icon_html_normal@2x.png';
import jpg from '@/pages/cloudTotal/image/tableIcon/icon_jpg_normal@2x.png';
import pdf from '@/pages/cloudTotal/image/tableIcon/icon_pdf_normal@2x.png';
import txt from '@/pages/cloudTotal/image/tableIcon/icon_txt_normal@2x.png';
import word from '@/pages/cloudTotal/image/tableIcon/icon_word_normal@2x.png';
import { IconProps } from '@/pages/cloudTotal/typing';

/**
 * date 2020/04/26
 * @param { string } iconType Support：'word' 'pdf' 'txt' 'info'
 * @param { number } height? icon's height
 * @param { number } offset? icon's position on 'Y'
 * @returns { FunctionComponent<IconProps> }
 */

export const Icon: FunctionComponent<IconProps> = ({ iconType, height = 14, style }) => {
  const defaultIconMap = {
    doc: word,
    docx: word,
    pdf: pdf,
    txt: txt,
    xlsx: exc,
    xls: exc,
    info: info,
    zlib: zlibOrHtml,
    html: zlibOrHtml,
    jpg: jpg,
    jpeg: jpg,
    png: jpg,
  };
  return (
    <IconBox>
      <img
        className="doc-icon"
        src={Object(defaultIconMap)[iconType] || iconType}
        style={{ height: `${height}px`, ...style }}
        alt={'err'}
      />
    </IconBox>
  );
};

const IconBox = styled.span`
  .doc-icon {
    cursor: pointer;
    display: inline-block;
  }
  img {
    object-fit: cover;
    width: 14px;
    height: 14px;
    image-rendering: -webkit-optimize-contrast;
  }
`;
