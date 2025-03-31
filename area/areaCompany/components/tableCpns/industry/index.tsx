import styled from 'styled-components';

import PopoverArrow from '@/pages/area/areaCompany/components/tableCpns/popoverArrow';

import { TextWrap } from '../textWrap';

export const isValidText = (text: string) => {
  return text && text !== '-';
};

/**
 * columns列国标行业的render方法，keys是从最顶级到最小一次的key
 */
export default (keys = ['industry', 'secondIndustry', 'thirdIndustry', 'fourthIndustry']) => {
  return (_: string, record: Record<string, any>) => {
    const popData = keys.reduce((prev, key) => {
      if (isValidText(record[key])) {
        prev.push(record[key]);
      }
      return prev;
    }, [] as string[]);
    return (
      <>
        {popData.length ? (
          <IndustryPopoverStyle>
            <TextWrap line={1}>{popData.slice(-1)}</TextWrap>
            <PopoverArrow
              data={<TooltipContent>{popData.join(' > ')}</TooltipContent>}
              classname="industry-arrow-popover-content"
              dontNeedMount
              container={document.getElementById('area-company-index-container')}
            />
          </IndustryPopoverStyle>
        ) : (
          '-'
        )}
      </>
    );
  };
};

export const IndustryPopoverStyle = styled.div`
  display: flex;
  align-items: center;
  > {
    flex-shrink: 0;
  }
`;

const TooltipContent = styled.div`
  color: #262626;
  font-size: 12px;
  line-height: 18px;
`;
