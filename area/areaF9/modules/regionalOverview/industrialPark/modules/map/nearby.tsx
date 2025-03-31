import { useSize } from 'ahooks';
import { isEmpty } from 'lodash';
import styled from 'styled-components';

import type { TableData } from '../main/type';

interface Props {
  tableData: TableData[];
  error: any;
  handleClick: (o: TableData) => void;
  selected: TableData | undefined;
}

const Nearby = ({ tableData, error, handleClick, selected }: Props) => {
  const size = useSize(document.querySelector('body'));

  if (!isEmpty(error) || isEmpty(size)) return null;

  return (
    <>
      {isEmpty(tableData) || tableData.length === 1 ? null : (
        <NearbyWrapper height={size!.height - 253}>
          <div className="wrapper">
            <div className="title">附近产业园区</div>
            <div className="content">
              {tableData.map((o) => (
                <div
                  className="item"
                  key={o.devZoneCode}
                  onClick={() => handleClick(o)}
                  style={{ color: selected?.devZoneName === o.devZoneName ? '#0171f6' : '' }}
                >
                  <div className="name">{o.devZoneName}</div>
                  <div className="position">{o.distance}公里</div>
                </div>
              ))}
            </div>
          </div>
        </NearbyWrapper>
      )}
    </>
  );
};

export default Nearby;

const NearbyWrapper = styled.div`
  position: absolute;
  top: 67px;
  left: 42px;
  width: 340px;
  overflow: hidden;

  .wrapper {
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.16);
    padding: 10px 4px 16px 12px;

    .title {
      height: 21px;
      font-size: 14px;
      color: #141414;
      line-height: 21px;
      font-weight: bold;
    }

    .content {
      overflow: auto;
      max-height: ${({ height }: { height: number }) => height + 'px'};
      padding-right: 3px;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #cfcfcf;
        border-radius: 4px;
        border: none;
      }
    }
    .item {
      font-size: 13px;
      color: #262626;
      line-height: 20px;
      margin-top: 6px;
      display: flex;
      justify-content: space-between;
      cursor: pointer;
      &:hover {
        color: #0171f6;
      }

      .name {
        max-width: 241px;
      }

      .position {
        color: #8c8c8c;
      }
    }
  }
`;
