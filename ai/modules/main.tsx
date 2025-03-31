import { forwardRef } from 'react';

import styled from 'styled-components';

import QueryArea from '@pages/ai/components/queryArea';

//type api接口， status: loading 状态

export interface Refs {
  getQuestion: (a: string) => void;
  openFindFunction: () => void;
}

interface Props {
  getQuestion: (a: string) => void;
  isFindFunction: boolean;
  toggleApi: () => void;
  isOnline: boolean;
  setIsOnline: (isOnline: boolean) => void;
}

const AiMain = forwardRef<Refs, Props>(({ getQuestion, isFindFunction, toggleApi, isOnline, setIsOnline }, ref) => {
  return (
    <Wrapper>
      <h1> </h1>
      <QueryArea
        getQuestion={getQuestion}
        isFindFunction={isFindFunction}
        toggleApi={toggleApi}
        isMain={true}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
      />
    </Wrapper>
  );
});

export default AiMain;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  background: url(${require(`../images/bg.png`)}) left top / cover;
  h1 {
    height: 46px;
    background: url(${require(`../images/h1.png`)}) no-repeat center center / contain;
    margin-top: 194px;
    margin-bottom: 24px;
    width: 217px;
  }
  .query-area {
    max-width: 660px;
    width: 100%;
    .box {
      height: 90px;
    }
  }
`;
