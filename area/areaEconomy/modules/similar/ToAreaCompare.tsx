import React from 'react';
import { useHistory } from 'react-router-dom';

import Styled from 'styled-components';

import arrowRight from '@/assets/images/area/arrow_right.svg';
import arrowRightHover from '@/assets/images/area/arrow_right_hover.svg';
import { LINK_AREA_COMPARE } from '@/configs/routerMap';

interface ToAreaCompareProps {
  query: string;
  target?: string;
  children?: JSX.Element;
  beforeLeave: () => Boolean;
}

function ToAreaCompare({ query, target, children, beforeLeave }: ToAreaCompareProps) {
  const history = useHistory();
  // const [mouseIn, setMouseIn] = useState(false);
  const href: string = `${LINK_AREA_COMPARE}${query}`;

  // const commonStyle: React.CSSProperties = React.useMemo(
  //   () => ({
  //     width: '51',
  //     height: '58px',
  //     background: mouseIn ? `red` : ``,
  //     backgroundSize: '28px 58px',
  //   }),
  //   [mouseIn],
  // );

  const go = React.useCallback(() => {
    if (!beforeLeave()) return;
    history.push(href);
    /* eslint-disable */
  }, [beforeLeave, query]);
  /* eslint-disable */

  // onMouseEnter={() => setMouseIn(true)} onMouseLeave={() => setMouseIn(false)}
  return (
    <Link onClick={go}>
      去比较
      <div className="arrow_right"></div>
    </Link>
  );
}

export default ToAreaCompare;

const Link = Styled.div`
  cursor: pointer;
  width: 100%;
  font-size: 13px;
  font-weight: 400;
  height: 61px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: point;
  padding: 0 8px 0 11px;
  .arrow_right{
    width: 9px;
    height: 9px;
    margin-left: 3px;
    background: url(${arrowRight}) no-repeat center center;
    background-size: 100% 100%;
  }
  &:hover{
    .arrow_right{
      background: url(${arrowRightHover}) no-repeat center center;
      background-size: 100% 100%;
    }

  }
`;
