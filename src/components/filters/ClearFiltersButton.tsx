interface ClearFiltersButtonProps {
  onClick: () => void;
  visible: boolean;
}

export function ClearFiltersButton({
  onClick,
  visible,
}: ClearFiltersButtonProps) {
  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      className="clear-filters-button"
      onClick={onClick}
      aria-label="Limpar todos os filtros"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M15 5L5 15M5 5l10 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Limpar Filtros
    </button>
  );
}
