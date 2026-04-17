import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="border border-border bg-background">
      <Skeleton className="h-1 w-full rounded-none bg-muted" />
      <div className="p-8 md:p-12">
        <div className="grid lg:grid-cols-[auto_1fr_1fr] gap-10 items-start">
          {/* Image placeholder */}
          <div className="flex items-center justify-center lg:justify-start">
            <Skeleton className="w-48 md:w-56 lg:w-64 aspect-square rounded-md bg-muted" />
          </div>
          {/* Text placeholders — 3 lines */}
          <div className="space-y-4">
            <Skeleton className="h-3 w-32 rounded-md bg-muted" />
            <Skeleton className="h-8 w-3/4 rounded-md bg-muted" />
            <Skeleton className="h-4 w-full rounded-md bg-muted" />
            <Skeleton className="h-4 w-5/6 rounded-md bg-muted" />
            <Skeleton className="h-4 w-4/6 rounded-md bg-muted" />
          </div>
          {/* Side panel */}
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-md bg-muted" />
            <div className="flex items-center justify-between pt-6">
              <Skeleton className="h-8 w-20 rounded-md bg-muted" />
              <Skeleton className="h-12 w-48 rounded-md bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
