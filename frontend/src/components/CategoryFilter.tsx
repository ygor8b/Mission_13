interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="mb-3">
      <button
        className={`btn me-2 mb-2 ${!selectedCategory ? 'btn-primary' : 'btn-outline-primary'}`}
        onClick={() => onSelectCategory(null)}
      >
        All Categories
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`btn me-2 mb-2 ${selectedCategory === cat ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
