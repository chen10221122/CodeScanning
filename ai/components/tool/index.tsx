import { FC } from 'react';

import styled from 'styled-components';

import { useNewChat } from '../../hooks/useChatDetail';

const Tool: FC<{ openLeftPanel: () => void }> = ({ openLeftPanel }) => {
  const { createChat } = useNewChat();
  return (
    <Wrapper>
      <ul>
        <li onClick={createChat}></li>
        <li onClick={createChat}></li>
        <li onClick={openLeftPanel}></li>
      </ul>
    </Wrapper>
  );
};

export default Tool;

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 22px;
  transform: translateY(-50%);
  background: #fff;

  border-radius: 12px;
  box-shadow: 0 4px 22px 6px rgba(0, 0, 0, 0.05);
  padding: 18px 9px;

  ul {
    margin: 0 auto;
    li {
      cursor: pointer;
      width: 19px;
      height: 19px;
      display: block;
      margin: 0 auto 20px;
      background: url(${require('../../images/chat.png')}) no-repeat center center / contain;

      &:first-of-type {
        width: 41px;
        height: 41px;
        background-image: url(${require('../../images/dragon_icon.png')});
        position: relative;
        margin-bottom: 28px;

        &:after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 21px;
          height: 1px;
          background: #e6e6e6;
        }
      }

      &:nth-of-type(2) {
        background-image: url(${require('../../images/chat.png')});
      }

      &:nth-of-type(3) {
        background-image: url(${require('../../images/note.png')});
        margin-bottom: 0;
      }

      &:nth-of-type(4) {
        background-image: url(${require('../../images/other.png')});
        margin-bottom: 0;
      }
    }
  }
`;
