// 回答内容

import styled from 'styled-components';

export default function StopButton({ onClick }: { onClick: () => void }) {
  return (
    <Container onClick={onClick}>
      <svg width="6" height="12" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="2" height="9" fill="#0171F6" />
        <rect x="4" y="0" width="2" height="9" fill="#0171F6" />
      </svg>
      停止生成
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 88px;
  height: 30px;
  padding-left: 12px;
  background: #ffffff;
  border-radius: 10px 10px 10px 0px;
  box-shadow: 0px 2px 19px 0px rgba(229, 231, 235, 0.36);
  cursor: pointer;
  margin-top: 8px;
  margin-left: 42px;
  color: #0171f6;
  line-height: 20px;
  font-size: 13px;
  font-weight: 500;
`;
