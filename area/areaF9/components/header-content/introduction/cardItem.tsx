import styled from 'styled-components';

import BusinessScopeInfo from './ExpandAndCollapse';
import RenderHeader from './header';
import { InfoItem } from './index';
import { prefix, css } from './style';

export const CardItem = ({ info, idx }: { info: InfoItem; idx: number }) => {
  return (
    <CardItemWrapper>
      <RenderHeader
        cpTxt={info?.value}
        url={info?.url}
        titleInfo={{
          index: idx,
          title: info?.name,
        }}
      />
      <div className={prefix('card-content')}>
        <BusinessScopeInfo txt={info?.value} />
      </div>
    </CardItemWrapper>
  );
};

const CardItemWrapper = styled.div`
  position: relative;
  width: 100%;
  z-index: 1;

  ${css('card-content')} {
    width: 100%;
    /* max-height: 60px; */
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    color: #141414;
    line-height: 20px;
  }
`;
