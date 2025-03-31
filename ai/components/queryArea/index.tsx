import { FC, useEffect, useRef, useState } from 'react';

import { Switch } from '@dzh/components';
import { useBoolean, useClickAway, useEventListener, useMemoizedFn } from 'ahooks';
import cn from 'classnames';
import styled from 'styled-components';

import Func from '@pages/ai/components/queryArea/func';
import Search, { ForwardObject } from '@pages/ai/components/queryArea/search';

import { baseColor } from '@/assets/styles';
import { KEY_BACKSPACE, KEY_DOWN, KEY_ENTER, KEY_ESC, KEY_UP } from '@/configs/keyCodes';
import { removeDom } from '@/utils/dom';

import Tags from './tags';
interface IProps {
  getQuestion: (node: string) => void;
  isFindFunction: boolean;
  toggleApi: () => void;
  isMain?: boolean;
  loading?: boolean;
  isOnline?: boolean;
  setIsOnline?: (isOnline: boolean) => void;
}

function insertHtmlAtCaret(html: string | HTMLElement, beforeInsert?: () => void) {
  const sel = window.getSelection();

  if (sel && sel.getRangeAt && sel.rangeCount) {
    let range = sel.getRangeAt(0);
    range.deleteContents();

    const el = document.createElement('div');

    if (typeof html === 'string') {
      el.innerHTML = html;
    } else {
      el.appendChild(html);
    }

    const frag = document.createDocumentFragment();
    let node;
    let lastNode;
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }

    beforeInsert?.();

    range.insertNode(frag);

    if (lastNode) {
      let r = range.cloneRange();
      const icon = (lastNode as HTMLElement).querySelector('i');
      r.setStartAfter(icon ? icon : lastNode);
      r.collapse(true);
      sel.removeAllRanges();
      sel.addRange(r);
    }
  }
}

const QueryArea: FC<IProps> = ({
  getQuestion,
  toggleApi,
  isFindFunction,
  isMain = false,
  loading = false,
  isOnline,
  setIsOnline,
}) => {
  const domRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<ForwardObject>(null);

  const [showPlaceHold, setShowPlaceHold] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [searchType, setType] = useState<number>(0);

  const [isChineseInput, setIsPinyin] = useState(false);
  const timeRef = useRef<NodeJS.Timeout>();
  const isSearchRef = useRef(false);
  const [isEdit, { setFalse, setTrue }] = useBoolean(false);

  const getResult = useMemoizedFn((item: any) => {
    if (item && domRef.current) {
      const node = document.createElement('b');
      node.contentEditable = 'false';
      node.innerHTML = '[' + item.name + ']';
      node.dataset.value = JSON.stringify(item.groupTop);

      let child = domRef.current.querySelector('.current');

      if (child) {
        while (child) {
          const parent = child.parentElement;

          if (parent?.tagName === 'SPAN') {
            child = parent as HTMLSpanElement;
          } else {
            break;
          }
        }

        domRef.current.replaceChild(node, child);
      }

      setKeyword('');
      isSearchRef.current = false;

      const sel = window.getSelection();

      if (sel) {
        let range = sel.getRangeAt(0);
        let r = range.cloneRange();
        r.setStartAfter(node);
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      }

      setType(0);
    }
  });

  const resetTimer = useMemoizedFn(() => {
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(() => {
      setIsPinyin(false);
    }, 600);
  });

  const submit = useMemoizedFn(() => {
    if (disabled || loading) return;

    if (domRef.current) {
      getQuestion(domRef.current.innerText);
      domRef.current && (domRef.current.innerHTML = '');
      setDisabled(true);
      setFalse();
    }
  });

  const addCompany = useMemoizedFn((e) => {
    e.preventDefault();
    // removeAllCurrent();

    domRef.current?.querySelectorAll('span').forEach((span) => removeDom(span));

    const node = document.createElement('span');
    node.className = 'current';
    const icon = document.createElement('i');
    icon.contentEditable = 'false';

    let type = 1;
    if (e.key === '#') {
      icon.className = 'func';
      type = 2;
    }

    node.append(icon, document.createTextNode(' '));
    if (e.type === 'click' && domRef.current) {
      domRef.current.focus();

      requestAnimationFrame(() => setShowPlaceHold(false));
    }
    insertHtmlAtCaret(node);
    isSearchRef.current = true;

    setType(type);
  });

  useEventListener(
    'keydown',
    (e) => {
      e.stopPropagation();
      const keyCode = e.keyCode;

      const sel = window.getSelection();

      if (keyCode === KEY_BACKSPACE && sel?.anchorNode && sel.anchorOffset <= 1) {
        const anchorNode = sel.anchorNode as HTMLElement;
        const el = anchorNode.previousElementSibling;
        const parent = anchorNode.parentElement;
        let delNode: HTMLSpanElement;
        if (el?.tagName === 'SPAN' && sel.anchorOffset === 0) delNode = el as HTMLSpanElement;
        if (parent?.tagName === 'SPAN') delNode = parent as HTMLSpanElement;
        if (anchorNode.tagName === 'SPAN') delNode = anchorNode;

        // @ts-ignore
        if (delNode) {
          e.preventDefault();
          removeDom(delNode);
          setKeyword('');
        }
      }

      if (searchRef.current) {
        if ([KEY_UP, KEY_DOWN, KEY_ESC, KEY_ENTER].includes(keyCode)) {
          e.preventDefault();

          switch (keyCode) {
            case KEY_ESC: {
              setKeyword('');
              break;
            }
            case KEY_UP: {
              if (keyword) searchRef.current.prev();
              break;
            }
            case KEY_DOWN: {
              if (keyword) searchRef.current.next();
              break;
            }
            case KEY_ENTER: {
              if (keyword) {
                searchRef.current.enter();
              } else {
                submit();
              }
              break;
            }
            default:
              break;
          }
        }
      } else if (keyCode === KEY_ENTER) {
        if (e.shiftKey) {
          // 按下shift+enter时插入换行
          const br = document.createElement('br');
          insertHtmlAtCaret(br);
        } else {
          e.preventDefault();
          submit();
        }
      }

      if (e.key === '@' || e.key === '#') addCompany(e);
    },
    { target: domRef },
  );

  const searchKeyword = useMemoizedFn(() => {
    if (isSearchRef.current && !isChineseInput && domRef.current) {
      const item = domRef.current.querySelector('span.current') as HTMLSpanElement;

      if (item) setKeyword(item.innerText.trim());
    }
  });

  useEventListener(
    'keyup',
    (e) => {
      const sel = window.getSelection();

      if (
        sel &&
        sel.type === 'Caret' &&
        sel.anchorNode &&
        (sel.anchorNode as HTMLElement).tagName === 'SPAN' &&
        sel.anchorOffset === 0
      ) {
        let range = sel.getRangeAt(0);
        let r = range.cloneRange();
        if (e.key === 'ArrowRight') {
          const el = (sel.anchorNode as HTMLElement).querySelector('i');
          if (el) r.setStartAfter(el);
        } else {
          r.setStartBefore(sel.anchorNode);
        }
        r.collapse(true);
        sel.removeAllRanges();
        sel.addRange(r);
      }

      const html = domRef.current?.innerText;
      const i = domRef.current?.querySelector('i');

      if (!i) {
        isSearchRef.current = false;
        setType(0);
        setKeyword('');
      }

      searchKeyword();

      requestAnimationFrame(() => setDisabled(html?.trim() === ''));
    },
    { target: domRef },
  );

  useEventListener(
    'click',
    () => {
      setShowPlaceHold(false);
      setTrue();
    },
    { target: domRef },
  );

  useEventListener(
    'paste',
    (e) => {
      e.preventDefault();

      // 获取粘贴的纯文本内容
      const plainText = e.clipboardData.getData('text/plain');
      // 插入纯文本内容
      document.execCommand('insertText', false, plainText);
      requestAnimationFrame(() => {
        setDisabled(!plainText);
        domRef.current && (domRef.current.scrollTop = 999999);
      });
    },
    { target: domRef },
  );
  useClickAway(() => {
    const html = domRef.current?.innerText;
    const i = domRef.current?.querySelector('i');

    setShowPlaceHold(html === '' && !i);
    setFalse();
  }, domRef);

  useEffect(() => {
    searchKeyword();
  }, [isChineseInput, searchKeyword]);

  return (
    <Wrapper className={cn({ isEdit }, 'query-area')}>
      {!isMain ? (
        <>
          <Tags isFindFunction={isFindFunction} toggleApi={toggleApi} />
          {searchType === 1 ? <Search getResult={getResult} keyword={keyword} ref={searchRef} /> : null}
          {searchType === 2 ? <Func keyword={keyword} /> : null}
        </>
      ) : null}
      <div className="box">
        <div className={'edit-container'}>
          {showPlaceHold ? (
            <span className={'placehold'}>请输入您要检索的内容，Enter键发送，Shift+Enter键换行</span>
          ) : null}
          <EditStyle
            className={'edit'}
            ref={domRef}
            contentEditable={true}
            onCompositionEnd={() => {
              setIsPinyin(false);
              if (timeRef.current) clearTimeout(timeRef.current);
            }}
            onCompositionStart={() => {
              setIsPinyin(true);
              resetTimer();
            }}
            onCompositionUpdate={resetTimer}
          />
        </div>
        <div className="box-footer">
          <div>
            <Switch size={'small'} checked={isOnline} onChange={(checked) => setIsOnline?.(checked)} />
            <span>联网搜索</span>
          </div>
          <span className={cn('fake-btn', { disabled: disabled || loading })} onClick={submit} />
        </div>
      </div>
      {isMain ? (
        <>
          {searchType === 1 ? (
            <Search getResult={getResult} keyword={keyword} ref={searchRef} vertical="bottom" />
          ) : null}
          {searchType === 2 ? <Func keyword={keyword} /> : null}
          <Tags isMain={isMain} isFindFunction={isFindFunction} toggleApi={toggleApi} />{' '}
        </>
      ) : null}
    </Wrapper>
  );
};

export default QueryArea;

const Wrapper = styled.div`
  flex: none;
  display: flex;
  flex-direction: column;
  line-height: 17px;
  font-size: 12px;
  position: relative;
  width: 100%;
  align-items: center;

  &.isEdit {
    .box {
      border-color: ${baseColor.primary};
    }
  }

  .box {
    width: 100%;
    padding: 12px 0px 8px 12px;
    border: 1px solid #bee3ff;
    min-height: 41px;
    background: #fff;
    border-radius: 12px;
    position: relative;
    /* display: flex;
    align-items: flex-start;
    justify-content: space-between; */

    overflow: hidden;
    .edit-container {
      flex: auto;
      position: relative;
      padding: 0;
      overflow-y: auto;
      max-height: calc(100% - 20px);
      width: 100%;
      padding-right: 12px;
      &::-webkit-scrollbar {
        width: 10px;
      }
      .placehold {
        position: absolute;
        color: #bfbfbf;
      }
    }

    .box-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0 8px;
      position: absolute;
      bottom: 0;
      left: 0;
      color: #262626;
      font-size: 12px;
      line-height: 18px;
    }

    .dzh-switch {
      transform: scale(${12 / 16});
      transform-origin: left top;
      position: relative;
      top: 1px;
      left: 4px;
    }

    .fake-btn {
      position: relative;
      /*
      bottom: 8px;
      right: 12px; */
      width: 30px;
      height: 23px;
      border-radius: 8px;
      background: linear-gradient(287deg, #26b5ff 7%, #1b78ff 91%);
      cursor: pointer;
      top: -7px;
      &.disabled {
        background: #cccfd5;
        cursor: not-allowed;
      }

      &:before {
        content: '';
        position: absolute;
        top: 4px;
        left: 6px;
        background: url(${require('../../images/btn-icon.png')});
        background-size: contain;
        width: 14px;
        height: 15px;
      }
    }
  }
`;

export const EditStyle = styled.div`
  min-height: 100%;
  position: relative;
  z-index: 2;
  outline: none;

  .current {
    padding: 0 6px 0 0;
    background: rgba(7, 93, 179, 0.1);
  }

  i {
    font-style: normal;
    display: inline-block;
    position: relative;
    padding: 0 2px 0 12px;
    height: 17px;
    vertical-align: bottom;

    &.func {
      padding-left: 8px;
      &:before {
        content: '#';
      }
    }

    &:before {
      content: '@';
      color: ${baseColor.primary};
      position: absolute;
      top: -1px;
      left: 0;
    }
  }

  b {
    color: ${baseColor.primary};
    font-weight: normal;
  }
`;
