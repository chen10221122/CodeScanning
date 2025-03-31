import { useMemo } from 'react';

const useColumn = (handleOpenModal: (raw: Record<string, any>, index: number) => void) => {
  const columns = useMemo(
    () =>
      [
        {
          title: '银行类型',
          dataIndex: 'bankTypeName',
          width: 97,
          align: 'left',
          className: 'pdd-8',
          render: (text: string, raw: any) => {
            return <span>{text || '-'}</span>;
          },
        },
        {
          title: '法人(个)',
          dataIndex: 'corporationCount',
          width: 97,
          align: 'right',
          className: 'pdd-8',
        },
        {
          title: '一级分行(个)',
          dataIndex: 'firstLevelBranchCount',
          width: 97,
          align: 'right',
          className: 'pdd-8',
        },
        {
          title: '二级分行(个)',
          dataIndex: 'secondLevelBranchCount',
          width: 97,
          align: 'right',
          className: 'pdd-8',
        },
        {
          title: '其他网点(个)',
          dataIndex: 'otherBusinessOutletsCount',
          width: 97,
          align: 'right',
          className: 'pdd-8',
        },
      ].map((column, index) => {
        return {
          ...column,
          render: (txt: number, raw: Record<string, any>) => {
            const isHover = index && txt !== 0;
            return (
              <div
                className={isHover ? 'link' : ''}
                onClick={
                  isHover
                    ? () => {
                        handleOpenModal(raw, index);
                      }
                    : undefined
                }
              >
                {txt}
              </div>
            );
          },
        };
      }),
    [handleOpenModal],
  );

  const scrollX = useMemo(() => {
    return columns.reduce((acc, cur) => acc + cur.width, 0);
  }, [columns]);

  return { columns, scrollX };
};

export default useColumn;
