import { memo, FC, useMemo } from 'react';

import { Card } from '@pages/area/itemDetail';
import { HelpTipStyle } from '@pages/area/itemDetail/modules';

interface ProjectFinancingProps {
  info: Record<string, any>;
}

const ProjectFinancing: FC<ProjectFinancingProps> = ({ info }) => {
  const projectFinancing = useMemo(
    () => [
      { name: '项目总投资额', value: info.projectTotalAmount, unit: '亿' },
      { name: '不含专项债的项目资本金', value: info.projectCapital, unit: '亿' },
      {
        name: '计划专项债融资额(亿)',
        value: info.financingAmountOfSpecialBonds,
        unit: '亿',
        tip: '项目投资额的计划的专项债融资额',
      },
      { name: '其他融资', value: info.otherFinancing, unit: '亿' },
      { name: '政府安排资金', value: info.governmentFunding, unit: '亿' },
      { name: '其他资金', value: info.otherCapital, unit: '亿' },
      {
        name: '当前专项债融资额/专项债只数',
        value: [
          {
            value: info?.specialBondAmount,
            unit: '亿',
          },
          {
            value: info?.specialBondNumber,
            unit: '只',
          },
        ],
        tip: '统计上的专项债融资和专项债只数',
      },
      { name: '专项债用作资本金', value: info.specialBondCapitalAmount, unit: '亿' },
    ],
    [
      info.financingAmountOfSpecialBonds,
      info.governmentFunding,
      info.otherCapital,
      info.otherFinancing,
      info.projectCapital,
      info.projectTotalAmount,
      info.specialBondCapitalAmount,
      info?.specialBondAmount,
      info?.specialBondNumber,
    ],
  );

  return (
    <Card title="项目筹资" style={{ marginBottom: '6px' }}>
      {projectFinancing?.length ? (
        <ul className="project-financing">
          {projectFinancing.map((o, i) => {
            return (
              <li key={i}>
                {o?.value ? (
                  Array.isArray(o.value) ? (
                    <div>
                      {o.value[0].value} <span>{o.value[0].unit}</span>
                      <span> / </span>
                      {o.value[1].value}
                      <span>{o.value[1].unit}</span>
                    </div>
                  ) : (
                    <div>
                      {o.value} <span>{o.unit}</span>
                    </div>
                  )
                ) : (
                  <div>-</div>
                )}
                <div className="name">
                  {o.name}
                  {o.tip ? <HelpTipStyle title={o.tip} iconStyle={{ marginLeft: '2px' }} /> : null}
                </div>
                <div className="bg-wrap"></div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </Card>
  );
};

export default memo(ProjectFinancing);
