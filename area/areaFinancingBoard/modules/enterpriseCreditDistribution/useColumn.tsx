import { useMemo } from 'react';

const useColumn = (handleOpenModal: (args: any) => void) => {
  const columns = useMemo(
    () =>
      [
        {
          title: '获授信企业类型',
          dataIndex: 'creditCompanyTypeName',
          width: 110,
          align: 'left',
          className: 'pdd-8',
          render: (text: string, raw: any) => {
            return <span>{text || '-'}</span>;
          },
        },
        {
          title: '公司家数',
          dataIndex: 'creditCompanyNum',
          width: 74,
          align: 'right',
          className: 'pdd-8',
        },
        {
          title: '剩余额度(亿)',
          dataIndex: 'remainAmount',
          width: 98,
          align: 'right',
          className: 'pdd-8',
        },
        {
          title: '已使用额度(亿)',
          dataIndex: 'usedAmount',
          width: 109,
          align: 'right',
          className: 'pdd-8',
        },
        {
          title: '总额度(亿)',
          dataIndex: 'totalAmount',
          width: 88,
          align: 'right',
          className: 'pdd-8',
        },
      ].map((column, index) => {
        return {
          ...column,
          render: (txt: any, raw: Record<string, any>) => {
            if (!txt) return <>-</>;
            const isHover = column.dataIndex === 'creditCompanyNum';
            return (
              <div
                className={isHover ? 'link' : ''}
                onClick={
                  isHover
                    ? () => {
                        handleOpenModal(raw);
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
    return columns.reduce((acc, cur) => acc + cur.width, 0) + columns.length - 1;
  }, [columns]);

  return { scrollX, columns };
};

export default useColumn;
