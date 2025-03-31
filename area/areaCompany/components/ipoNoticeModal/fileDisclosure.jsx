import { useMemo, memo } from 'react';
import { Link } from 'react-router-dom';

import { Table } from '@/components/antd';
import PDF_image from '@/pages/detail/modules/enterprise/securitiesIssue/common/images/pdf@2x.png';
import { getExternalLink } from '@/utils/format';
import { shortId } from '@/utils/share';

import S from '@/pages/detail/modules/enterprise/securitiesIssue/style.module.less';

const FileDisclosure = ({ dataSource }) => {
  const formatResult = useMemo(() => {
    return [
      { fileType: '招股说明书', applicationDate: dataSource?.[8223] },
      { fileType: '审计报告', applicationDate: dataSource?.[8346] },
      { fileType: '法律意见书', applicationDate: dataSource?.[8349] },
      { fileType: '发行保荐书', applicationDate: dataSource?.[8903] },
      { fileType: '上市保荐书', applicationDate: dataSource?.[8909] },
    ];
  }, [dataSource]);

  const handleDatePDF = (row, code) => {
    const data = row?.applicationDate?.[code];
    return (
      <>
        {data?.length
          ? data.map((d) => {
              return (
                <div className={S.datePdf_info} key={d.path}>
                  <span>{d.publishDate}</span>
                  {d?.path ? (
                    <Link to={getExternalLink(d?.path, true)}>
                      <img src={PDF_image} alt="" />
                    </Link>
                  ) : (
                    <span>{d?.title}</span>
                  )}
                  <span className={S.notLastComma}>,</span>
                </div>
              );
            })
          : '-'}
      </>
    );
  };

  const columns = useMemo(
    () => [
      { title: '文件类型', key: 'fileType', dataIndex: 'fileType' },
      {
        title: '申报稿日期',
        key: 'applicationDate',
        dataIndex: 'applicationDate',
        width: '28%',
        render: (_, row) => handleDatePDF(row, 8897),
      },
      {
        title: '上会稿日期',
        key: 'dueDate',
        dataIndex: 'dueDate',
        width: '28%',
        render: (_, row) => handleDatePDF(row, 8898),
      },
      {
        title: '注册稿日期',
        key: 'registrationDate ',
        dataIndex: 'registrationDate ',
        width: '28%',
        render: (_, row) => handleDatePDF(row, 8899),
      },
    ],
    [],
  );

  return <Table rowKey={() => shortId()} columns={columns} dataSource={formatResult} isStatic type="stickyTable" />;
};

export default memo(FileDisclosure);
