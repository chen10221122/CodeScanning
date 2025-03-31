import TextWrap from '@/pages/area/areaCompany/components/tableCpns/textWrap';

type Item = string | null | undefined;

export const isNull = (str: Item) => {
  return str || '-';
};

export const handleSortDirections = (column: Record<string, any>) => {
  const defaultDesc = ['注册资本', '最新展望', '最新主体评级'].includes(column.title);
  return {
    ...column,
    sortDirections: defaultDesc || column.title.includes('日期') ? ['descend', 'ascend'] : ['ascend', 'descend'],
    render: column?.render ? column.render : (txt: any) => <TextWrap>{isNull(txt)}</TextWrap>,
  };
};

export const replaceSymble = (str: any) => {
  return !str ? '' : str.replace('（', '(').replace('）', ')');
};
