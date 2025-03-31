import { memo } from 'react';

interface Props {
  text: any;
  handleClick: () => void;
}

const TableCell = ({ text, handleClick }: Props) => {
  return (
    <span>
      {text === 0 || text === '0' ? (
        0
      ) : text && text !== '-' ? (
        <span className={'link'} onClick={handleClick}>
          {text}
        </span>
      ) : (
        '-'
      )}
    </span>
  );
};

export default memo(TableCell);
