export function SuggestionCardSkeleton() {
  return (
    <div className="bg-card flex animate-pulse flex-col overflow-hidden rounded-xl border shadow-sm">
      <div className="bg-muted h-32 w-full" />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex gap-3">
          <div className="bg-muted h-4 w-24 rounded" />
          <div className="bg-muted h-4 w-20 rounded" />
        </div>
        <div className="bg-muted h-4 w-40 rounded" />
        <div className="flex gap-2">
          <div className="bg-muted h-14 flex-1 rounded-md" />
          <div className="bg-muted h-14 flex-1 rounded-md" />
          <div className="bg-muted h-14 flex-1 rounded-md" />
        </div>
        <div className="flex gap-1.5">
          <div className="bg-muted h-5 w-14 rounded" />
          <div className="bg-muted h-5 w-14 rounded" />
        </div>
        <div className="bg-muted mt-1 h-9 w-full rounded-md" />
      </div>
    </div>
  );
}
