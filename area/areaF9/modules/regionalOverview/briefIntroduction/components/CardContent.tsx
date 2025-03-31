import { FC, useMemo } from 'react';

const BLANK_LINE = `<div style="height:8px"></div>`;
const TEXT_INDENT = `<span style="display:inline-block;width:2em"></span>`;
const BRACES_INDENT = `<span style="display:inline-block;width:1.5em"></span>`;
/** 正则替换字符串 空行+缩进*/
const REGULAR_REPLACE_SPACE = `${BLANK_LINE}${TEXT_INDENT}`;
const REGULAR_REPLACE_BRACKET = `${BLANK_LINE}${BRACES_INDENT}【`;

type Props = {
  /** 卡片内容*/
  innerValue?: string;
};

const CardContent: FC<Props> = ({ innerValue }) => {
  let htmlText = useMemo(() => {
    let hTxt = '-';
    if (innerValue) {
      //匹配四个空格加【
      let text_1 = innerValue.trim().replace(/\s{4,}【/g, `${REGULAR_REPLACE_BRACKET}`);
      //匹配四个空格
      let text_2 = text_1.trim().replace(/\s{4,}/g, `${REGULAR_REPLACE_SPACE}`);
      /** 是否【开头 */
      let isBeginWithBrackets = text_2.trim().startsWith('【');
      hTxt = isBeginWithBrackets ? `${BRACES_INDENT}${text_2}` : `${TEXT_INDENT}${text_2}`;
    }
    return hTxt;
  }, [innerValue]);

  return <div dangerouslySetInnerHTML={{ __html: htmlText }}></div>;
};
export default CardContent;
