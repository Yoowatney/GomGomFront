import Style from './style.module.scss';

interface ISortOrderSelect {
  sortOrder: 'desc' | 'asc';
  onSortOrderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SortOrderSelect = (props: ISortOrderSelect) => {
  const { sortOrder, onSortOrderChange } = props;

  return (
    <div className={Style.SelectSortOrderWrapper}>
      <select
        className={Style.SelectSortOrder}
        onChange={onSortOrderChange}
        value={sortOrder}
      >
        <option value={'desc'}>최신 순</option>
        <option value={'asc'}>오래된 순</option>
      </select>
    </div>
  );
};
export default SortOrderSelect;
