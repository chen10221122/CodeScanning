import { memo, FC } from 'react';

import { Card } from '@pages/area/itemDetail';

interface ProjectIntroductionProps {
  projectDesc: string;
}

const ProjectIntroduction: FC<ProjectIntroductionProps> = ({ projectDesc }) => {
  return (
    <Card title="项目介绍">
      <div className="intro-content">{projectDesc}</div>
    </Card>
  );
};

export default memo(ProjectIntroduction);
