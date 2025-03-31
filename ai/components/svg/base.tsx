// 生成一个右侧容器组件
import React, { useState, useMemo, useEffect, useRef } from 'react';

import cn from 'classnames';
import styled from 'styled-components';

// 定义 ImageProps
interface ImageProps {
  type: string;
  className?: string;
  text?: string;
  onClick?: () => void;
  active?: boolean;
}

// 高阶函数：接受 ComponentMap 作为参数，返回新的组件
const withComponentMap = (ComponentMap: Record<string, { default: React.FC; hover: React.FC }>) => {
  const Image: React.FC<ImageProps> = ({ type, className, text, onClick, active }) => {
    const [isHovered, setIsHovered] = useState(false);
    const divRef = useRef<HTMLDivElement | null>(null);

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
        if (divRef.current) {
          const rect = divRef.current.getBoundingClientRect();
          const { clientX, clientY } = event;

          if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
            setIsHovered(false);
          }
        }
      };

      if (isHovered) {
        window.addEventListener('mousemove', handleMouseMove);
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }, [isHovered]);

    const Icon = useMemo(() => {
      return ComponentMap[type] ? ComponentMap[type][isHovered || active ? 'hover' : 'default'] : null;
    }, [type, isHovered, active]);

    return (
      <Wrap ref={divRef} className={cn(className, { active })} onMouseMove={handleMouseEnter} onClick={onClick}>
        {Icon && <Icon />}
        {text && <span>{text}</span>}
      </Wrap>
    );
  };

  return Image;
};

export default withComponentMap;

const Wrap = styled.span`
  display: flex;
  align-items: center;
  span {
    margin-left: 4px;
  }
`;
