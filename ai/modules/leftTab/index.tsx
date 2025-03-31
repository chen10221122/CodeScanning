import { FC } from 'react';

import { Popover } from '@dzh/components';
import styled from 'styled-components';

import Image from './components/image';
const list = [
  {
    type: 'add',
    content: '新对话',
  },
  {
    type: 'function',
    content: '找功能',
  },
  {
    type: 'data',
    content: '查数据',
  },
  {
    type: 'notice',
    content: '查公告',
  },
  {
    type: 'finance',
    content: '区域经济',
  },
];
const LeftTab: FC = () => {
  return (
    <Wrapper>
      <div className="logo"></div>
      <ul>
        {list.map((item) => (
          <li key={item.type}>
            <Popover content={item.content} placement="right" trigger="hover" align={{ offset: [-1, 0] }}>
              <span>
                <Image type={item.type} />
              </span>
            </Popover>
          </li>
        ))}
      </ul>
      <div className="history-icon"></div>
    </Wrapper>
  );
};

export default LeftTab;

const Wrapper = styled.div`
  height: 100%;
  padding: 0 10px;
  border-right: 1px solid rgba(151, 151, 151, 0.13);
  position: relative;
  .logo {
    margin-top: 24px;
  }
  ul {
    display: flex;
    flex-direction: column;
    gap: 24px;
    li {
      cursor: pointer;
    }
  }
  .history-icon {
    width: 18px;
    height: 18px;
    background-image: url(${require('../../images/svg/history.svg')});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
    position: absolute;
    left: 10px;
    bottom: 13px;
  }
`;
