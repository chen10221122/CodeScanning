import { memo, FC, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { Table, HorizontalTableColumnsType } from '@dzh/components';

import { Card } from '@pages/area/itemDetail';
import TextEllipsis from '@pages/bond/specialBond/components/foldDropMenuNew';

import { LINK_DETAIL_ENTERPRISE } from '@/configs/routerMap';
import { dynamicLink } from '@/utils/router';
import { urlJoin, urlQueriesSerialize } from '@/utils/url';
const WIDTH = [90];
interface ProjectPartyProps {
  info: Record<string, any>;
}

const ProjectParty: FC<ProjectPartyProps> = ({ info }) => {
  const history = useHistory();

  const columns: HorizontalTableColumnsType = useMemo(
    () => [
      [
        {
          title: '项目主体',
          render: (text, record) => {
            const [names, codes] = record?.projectBodies?.reduce(
              (prev: string[][], cur: any) => {
                prev[0].push(cur?.personName);
                prev[1].push(cur?.personCode2);
                return prev;
              },
              [[], []],
            ) || [[], []];
            return record?.projectBodies?.length ? (
              <TextEllipsis
                overlayClassName={'project-table-popover'}
                names={names}
                codes={codes}
                // getPopupContainer={getPopupContainer}
                onLink={(code: string) =>
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                      urlQueriesSerialize({ type: 'company', code }),
                    ),
                  )
                }
                moreLink={(code: string) =>
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'businessWarning' }),
                      urlQueriesSerialize({ type: 'company', code }),
                      '#招投标',
                    ),
                  )
                }
              />
            ) : (
              '-'
            );
          },
        },
        {
          title: '主管部门',
          render: (_, record) => {
            const [names, codes] = record?.competentDepartments?.reduce(
              (prev: string[][], cur: any) => {
                prev[0].push(cur?.personName);
                prev[1].push(cur?.personCode2);
                return prev;
              },
              [[], []],
            ) || [[], []];
            return record?.competentDepartments?.length ? (
              <TextEllipsis
                overlayClassName={'project-table-popover'}
                names={names}
                codes={codes}
                // getPopupContainer={getPopupContainer}
                onLink={(code: string) =>
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                      urlQueriesSerialize({ type: 'company', code }),
                    ),
                  )
                }
                moreLink={(code: string) =>
                  history.push(
                    urlJoin(
                      dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'businessWarning' }),
                      urlQueriesSerialize({ type: 'company', code }),
                      '#招投标',
                    ),
                  )
                }
              />
            ) : (
              '-'
            );
          },
        },
        {
          title: '实施单位',
          render: (_, record) => {
            if (record?.constructionUnits?.length) {
              let nameList: any[] = [],
                urlList: any[] = [];
              record.constructionUnits.forEach((element: any) => {
                nameList.push(element?.personName);
                urlList.push(element?.personCode2 || '');
              });
              return (
                <TextEllipsis
                  overlayClassName={'project-table-popover'}
                  names={nameList}
                  codes={urlList}
                  // getPopupContainer={getPopupContainer}
                  onLink={(code: string) =>
                    history.push(
                      urlJoin(
                        dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'overview' }),
                        urlQueriesSerialize({ type: 'company', code }),
                      ),
                    )
                  }
                  moreLink={(code: string) =>
                    history.push(
                      urlJoin(
                        dynamicLink(LINK_DETAIL_ENTERPRISE, { key: 'businessWarning' }),
                        urlQueriesSerialize({ type: 'company', code }),
                        '#招投标',
                      ),
                    )
                  }
                />
              );
            } else {
              return '-';
            }
          },
        },
      ],
    ],
    [history],
  );

  return (
    <Card title="项目当事人">
      <Table.Horizontal columns={columns} dataSource={info} width={WIDTH} />
    </Card>
  );
};

export default memo(ProjectParty);
