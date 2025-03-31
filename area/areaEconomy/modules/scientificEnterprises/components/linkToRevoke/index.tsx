import { useHistory } from 'react-router-dom';

import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { LINK_REVOKE_TECHNOLOGY_ENTERPRISE } from '@/configs/routerMap';

import Arrow from '../../image/arrow_active.webp';
import CoIcon from '../../image/co@2x.png';
// import {useTab} from "@/libs/route";

const LinkToRevokePage = () => {
  const history = useHistory();
  // const { remove } = useTab();
  const linkToRevoke = useMemoizedFn((): void => {
    // remove()
    history.push(LINK_REVOKE_TECHNOLOGY_ENTERPRISE);
  });

  return (
    <Wapper onClick={() => linkToRevoke()}>
      <span className="link">被撤销科技型企业资格</span>
    </Wapper>
  );
};

export default LinkToRevokePage;

const Wapper = styled.div`
  width: 160px;
  height: 18px;
  line-height: 18px;
  cursor: pointer;
  .link {
    font-size: 13px;
    font-weight: 400;
    color: #0171f6;
    line-height: 18px;
  }
  .link:before {
    content: '';
    display: inline-block;
    height: 15px;
    width: 15px;
    background: url(${CoIcon}) no-repeat;
    background-size: 100% 100%;
    position: relative;
    top: 3px;
    right: 4px;
  }

  .link:after {
    content: '';
    display: inline-block;
    height: 9px;
    width: 9px;
    background: url(${Arrow}) no-repeat;
    background-size: 100% 120%;
    position: relative;
    top: -1px;
    left: 4px;
  }
`;
