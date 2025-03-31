import { useContextHelper } from '@pages/area/areaRank/provider';

import Card from './card';
import S from './styles.module.less';
const Category = () => {
  const {
    wholeModuleWrapperRef,
    activeCategory,
    categoryList,
    updateActiveCategory,
    updateCategoryLoading,
    resetScreen,
  } = useContextHelper();
  const handleClick = (v: string) => {
    if (activeCategory === v) return;
    wholeModuleWrapperRef?.scrollIntoView();
    resetScreen();
    updateCategoryLoading(true);
    updateActiveCategory(v);
  };
  return (
    <div className={S.categoryContainer}>
      {categoryList?.map((item, i) => {
        return <Card activeCategory={activeCategory} data={item} key={i} onClick={handleClick} />;
      })}
    </div>
  );
};
export default Category;
