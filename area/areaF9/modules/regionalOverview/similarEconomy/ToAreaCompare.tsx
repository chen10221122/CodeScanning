import React from 'react';
import { useHistory } from 'react-router-dom';

import Styled from 'styled-components';

import arrowRight from '@/assets/images/area/arrow_right.svg';
// import arrowRightHover from '@/assets/images/area/arrow_right_hover.svg';
import { AREA_COMPARE_SELECTED_CODE } from '@/configs/localstorage';
import { LINK_AREA_COMPARE } from '@/configs/routerMap';

import { AreaShareParams } from './utils';

interface ToAreaCompareProps {
  query: string;
  target?: string;
  children?: JSX.Element;
  areas?: AreaShareParams;
  beforeLeave?: () => Boolean;
}

function ToAreaCompare({ query, target, children, areas, beforeLeave }: ToAreaCompareProps) {
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
    // if (!beforeLeave?.()) return;
    history.push(href);
    localStorage.setItem(AREA_COMPARE_SELECTED_CODE, JSON.stringify(areas?.codes));
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
  // width: 100%;
  width:54px;
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #025cdc;
  display: flex;
  align-items: center;
  white-space:nowrap;
  justify-content: center;
  background: #f1f8ff;
  border-radius: 2px;
  height:18px;
  line-height:18px;
  // padding: 0 8px 0 11px;
  // height:72px;
  .arrow_right{
    min-width:9px;
    width: 9px;
    height: 9px;
    margin-left: 3px;
    background: url(${arrowRight}) no-repeat center center;
    background-size: 100% 100%;
  }
`;
