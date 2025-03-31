import { FC, useEffect, useState } from 'react';

import styled from 'styled-components';

import { DialogContext } from '@/components/search';
import FunctionSearch, { IData } from '@/components/search/components/searching/FunctionSearch';
import { useFuncList } from '@/components/search/components/searching/hooks/useFeatureConfig';
import { SEARCH_DIALOG_ENTRY } from '@/configs/constants';

interface IProps {
  keyword: string;
}

const Func: FC<IProps> = ({ keyword }) => {
  const { funcList, runFunc } = useFuncList();

  const [list, setList] = useState<IData[]>([]);

  const onSearchClickCapture = () => {
    // console.log('onSearchClickCapture');
  };
  const onSearchLineClick = () => {
    // console.log('onSearchLineClick');
  };
  useEffect(() => {
    if (funcList.length) setList(funcList);
  }, [funcList]);

  useEffect(() => {
    if (keyword) {
      runFunc({ text: keyword });
    } else {
      setList([]);
    }
  }, [keyword, runFunc]);

  if (!keyword || !list.length) return null;

  return (
    <Wrapper>
      <DialogContext.Provider
        value={{
          onSearchLineClick,
          onSearchClickCapture,
        }}
      >
        <FunctionSearch data={list} from={SEARCH_DIALOG_ENTRY} keyword={keyword} />
      </DialogContext.Provider>
    </Wrapper>
  );
};

export default Func;

const Wrapper = styled.div`
  position: absolute;
  top: -304px !important;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px -3px 6px -4px rgba(0, 0, 0, 0.02), 0px -4px 22px 6px rgba(0, 0, 0, 0.05);
  z-index: 100;
  height: 338px;
  overflow-y: auto;
`;
