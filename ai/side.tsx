import { FC, useEffect, useMemo, useRef } from 'react';

import { useSize } from 'ahooks';
import styled from 'styled-components';

import AiCore, { Refs } from '@pages/ai/aiCore';

interface IProps {
  close: () => void;
  getStatus?: (isOpen: boolean) => void;
}

const questions = [
  '汽车行业的负面舆情平均指数是多少？',
  '企业负面舆情指数的定义？',
  '企业负面舆情指数的计算方法？',
  '企业负面舆情指数的影响因素？',
];

const AiSide: FC<IProps> = ({ close, getStatus }) => {
  const domRef = useRef<HTMLDivElement>(null);
  const { width } = useSize(domRef) || { width: 0 };

  const ref = useRef<Refs>(null);
  const scrollTopDom = useMemo(() => {
    return (
      <>
        <h3> </h3>
        <ul className={'fast'}>
          {questions.map((s) => (
            <li onClick={() => ref.current?.getQuestion(s)} key={s}>
              {s}
            </li>
          ))}
        </ul>
      </>
    );
  }, []);

  useEffect(() => {
    getStatus?.(!!width);
  }, [width, getStatus]);

  return (
    <Outer ref={domRef}>
      <span className={'close'} onClick={close}>
        &times;
      </span>

      <AiCore ref={ref} scrollTopDom={scrollTopDom} />
    </Outer>
  );
};

export default AiSide;

const Outer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #fff;

  > div {
    padding: 0 20px;

    .scroll {
      margin: 0 -20px;
      padding: 0 20px;
    }

    .query-area {
      > ul li {
        border: 1px solid #e5e5e5;

        &:hover {
          border-image: linear-gradient(249deg, rgba(49, 244, 255, 0.1) 0%, rgba(122, 171, 255, 0.1));
        }
      }
    }
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #c9c9c9;
    font-size: 16px;
    width: 16px;
    height: 16px;
    line-height: 1;
    text-align: center;
    cursor: pointer;
  }

  a[from='search-dialog-page-entry'] {
    width: calc(100% - 16px);
    margin: 0 8px 8px;
  }

  h3 {
    background: url(${require('./images/title.png')}) no-repeat 2px 10px;
    background-size: 85px 24px;
    height: 38px;
    flex: none;
  }

  .fast {
    color: #383838;
    line-height: 26px;

    li {
      padding: 8px 16px;
      background: #f2f8ff;
      border-radius: 12px 12px 0 12px;
      margin: 0 0 6px;
      cursor: pointer;
    }
  }
`;
