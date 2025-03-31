import { useState, FC, ReactNode, useRef, useEffect, memo, useMemo } from 'react';
import { ResizableBox } from 'react-resizable';

import { useCreation, useMemoizedFn, useSize } from 'ahooks';
import cn from 'classnames';
import { isUndefined } from 'lodash';

import { useTab } from '@/libs/route';

import styles from './styles.module.less';
interface ResizeProps {
  topContent: ReactNode;
  bottomContent: ReactNode;
  topMinHeight?: number;
  bottomMinHeight?: number;
  foldHeight?: number;
  highlightFoldButton?: boolean;
  onFoldChange?: (v: boolean) => void;
}

type ConstraintsType = [number, number];

const HANDLE_LINE_HEIGHT = 8;

const Resize: FC<ResizeProps> = ({
  topContent,
  bottomContent,
  topMinHeight = 200,
  bottomMinHeight = 200,
  foldHeight = 0,
  highlightFoldButton = false,
  onFoldChange,
}) => {
  const [resizeBoxHeight, setResizeBoxHeight] = useState(0);
  const [fold, setFold] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const { width, height } = useSize(containerRef) || { width: 0, height: 0 };
  const { height: bodyHeight } = useSize(document.body) || { width: 0, height: 0 };
  const heightRef = useRef(height);
  const [widthCache, setWidthCache] = useState(width);

  const hasBottom = useCreation(() => !isUndefined(bottomContent), [bottomContent]);

  const getDefaultHeight = useMemoizedFn(() => {
    const _bottomHeight = 0.4 * height;
    const bottomHeight = hasBottom
      ? _bottomHeight >= bottomMinHeight + HANDLE_LINE_HEIGHT
        ? _bottomHeight
        : bottomMinHeight + HANDLE_LINE_HEIGHT
      : 0;
    const _height = height - bottomHeight;

    return _height >= topMinHeight ? _height : topMinHeight;
  });

  const resetHeight = useMemoizedFn(() => {
    if (height) {
      setResizeBoxHeight(getDefaultHeight());
    }
  });

  useTab({
    onActive() {
      if (bodyHeight !== heightRef.current) {
        heightRef.current = bodyHeight;
        resetHeight();
      }
    },
    onDeActive() {
      heightRef.current = bodyHeight;
    },
  });

  useEffect(() => {
    onFoldChange?.(fold);
  }, [fold, onFoldChange]);

  useEffect(() => {
    resetHeight();
  }, [bodyHeight, resetHeight]);

  useEffect(() => {
    if (resizeBoxHeight === 0) {
      resetHeight();
    }
  }, [height, resetHeight, resizeBoxHeight]);

  useEffect(() => {
    resetHeight();
  }, [hasBottom, resetHeight]);

  useEffect(() => {
    if (width) {
      setWidthCache(width);
    }
  }, [width]);

  const handleLine = useCreation(
    () =>
      hasBottom ? (
        <div
          className={cn(styles['resizable-handle'], 'resizable-handle-line')}
          style={{ cursor: fold ? 'default' : 'ns-resize' }}
        >
          <div
            className={cn(styles['fold-button'], {
              [styles['fold-button-down']]: fold,
              [styles['fold-button-highlight']]: fold && highlightFoldButton,
            })}
            onClick={() => setFold((preState) => !preState)}
          />
        </div>
      ) : undefined,
    [hasBottom, fold, highlightFoldButton, setFold],
  );

  const minConstraints: ConstraintsType = useCreation(() => [NaN, topMinHeight], [topMinHeight]);

  const maxConstraints: ConstraintsType = useCreation(
    () => [NaN, height - (fold ? HANDLE_LINE_HEIGHT + foldHeight : bottomMinHeight)],
    [height, fold, foldHeight],
  );

  const isMin = useMemo(
    () => height < topMinHeight + bottomMinHeight + HANDLE_LINE_HEIGHT,
    [bottomMinHeight, height, topMinHeight],
  );

  const onResize = useMemoizedFn((_, data) => {
    if (!fold && !isMin) {
      const curHeight = data?.size?.height;
      setResizeBoxHeight(curHeight ? (curHeight >= topMinHeight ? curHeight : topMinHeight) : getDefaultHeight());
    }
  });

  const bottomStyle = useCreation(
    () => ({
      minHeight: `${fold ? foldHeight + HANDLE_LINE_HEIGHT : bottomMinHeight}px`,
      flex: 1,
      paddingTop: '6px',
      overflow: fold ? 'hidden' : 'overlay auto',
    }),
    [resizeBoxHeight, fold, foldHeight],
  );

  const containerStyle = useCreation(
    () => ({ overflow: isMin ? 'auto' : 'hidden' }),
    [bottomMinHeight, height, topMinHeight, isMin],
  );

  return (
    <div className={cn(styles.container, 'resize-container')} ref={containerRef} style={containerStyle}>
      <ResizableBox
        className={cn(styles['resizable-box'], 'resize-top-container')}
        axis="y"
        onResize={onResize}
        width={widthCache || document.body.clientWidth}
        height={fold ? height - foldHeight - HANDLE_LINE_HEIGHT : resizeBoxHeight}
        minConstraints={minConstraints}
        maxConstraints={maxConstraints}
        handle={fold || isMin ? undefined : handleLine}
      >
        {topContent}
        {fold || isMin ? handleLine : null}
      </ResizableBox>
      {hasBottom ? (
        <div className="resize-bottom-container" style={bottomStyle}>
          {bottomContent}
        </div>
      ) : null}
    </div>
  );
};

export default memo(Resize);
