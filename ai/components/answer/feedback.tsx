// 回答内容

import { useMemo, useRef, useState } from 'react';

import { Checkbox, Input, Button } from '@dzh/components';
import Screen, { Options, ScreenType } from '@dzh/screen';
import { useMemoizedFn } from 'ahooks';
import styled from 'styled-components';

import { QUESTION_TYPE } from '../../types';

// 企业问答反馈

const COMPANY_TYPE = [
  {
    title: '主体问题',
    type: '0',
    children: ['主体错误', '主体遗漏'],
  },
  {
    title: '参数问题',
    type: '1',
    children: ['参数错误', '参数遗漏'],
  },
  {
    title: '指标问题',
    type: '2',
    children: ['指标错误', '指标遗漏'],
  },
];

const FEEDBACK_TYPE = [
  {
    title: '专题问题',
    type: '0',
    children: ['专题错误', '前三匹配的专题都错误'],
  },
  {
    title: '参数问题',
    type: '1',
    children: ['参数错误', '参数遗漏'],
  },
  {
    title: '指标问题',
    type: '2',
    children: ['指标错误', '指标遗漏'],
  },
];

export default function Feedback({
  onClose,
  onFeedback,
  type,
}: {
  onClose: (bool: boolean) => void;
  onFeedback?: (questionType: string, feedback: string) => Promise<any> | undefined;
  type?: QUESTION_TYPE;
}) {
  const [value, setValue] = useState<string>('');
  const [screenValue, setScreenValue] = useState<any[]>([]);
  const [other, setOther] = useState<string>('');
  const onSubmit = useMemoizedFn(async () => {
    const res = await onFeedback?.(screenValue.join(',') + (other ? ',其他' : ''), value);
    if (res?.returncode === 0) {
      onClose(true);
    }
  });

  const dataConfig: Options[] = useMemo(() => {
    const list = type === QUESTION_TYPE.COMPANY ? COMPANY_TYPE : FEEDBACK_TYPE;
    return list.map((it) => {
      const title = <Checkbox checked={false}>{it.title}</Checkbox>;
      return {
        title,
        formatTitle: (rows: any[]) => {
          const values = rows.map((it) => it.value);
          return <Checkbox checked={!!it.children.find((child) => values.includes(child))}>{it.title}</Checkbox>;
        },
        option: {
          type: ScreenType.MULTIPLE,
          children: it.children.map((child) => {
            return {
              name: child,
              value: child,
            };
          }),
        },
      };
    });
  }, [type]);
  const refDom = useRef<HTMLDivElement>(null);
  const onChange = (value: any, allSelectedRows: any[]) => {
    setScreenValue(allSelectedRows.map((it) => it.value));
  };

  const onChangeOther = (e: any) => {
    setOther(e.target.checked);
  };
  const onChangeValue = (e: any) => {
    setValue(e.target.value);
  };
  return (
    <Container ref={refDom}>
      <div className="top">
        <div>问题反馈：</div>
        <Screen options={dataConfig} onChange={onChange} getPopContainer={() => refDom.current || document.body} />
        <div className="child-container">
          <Checkbox onChange={onChangeOther}>其他</Checkbox>
        </div>
      </div>
      <Input.TextArea placeholder="输入你的问题" className="input" value={value} onChange={onChangeValue} />
      <div className="button">
        <Button size="26" onClick={() => onClose(false)}>
          取消
        </Button>
        <Button type="primary" size="26" onClick={onSubmit}>
          提交
        </Button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .top {
    margin-top: 14px;
    display: flex;
    align-items: center;
    .dzh-screen-items-wrapper {
      min-height: 40px;
    }
    .dzh-screen-screen-wrapper .dzh-screen-screen-title-wrapper > span {
      margin-left: -2px;
    }
    .child-container {
      margin-top: -2px;
    }
    .dzh-screen-screen-wrapper .dzh-screen-screen-title-wrapper {
      margin-right: 16px;
    }
  }
  .input {
    height: 50px;
    width: 500px;
    border-color: #fff;
    margin: 6px 0;
  }
  .button {
    .ant-btn {
      margin-right: 10px;
      width: 70px;
      padding: 3px 0px;
    }
  }
`;
