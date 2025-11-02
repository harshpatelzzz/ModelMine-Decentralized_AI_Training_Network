import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function JobCardSkeleton() {
  return (
    <Card className="glass">
      <CardHeader>
        <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-2 w-full bg-muted animate-pulse rounded" />
        <div className="flex gap-4">
          <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCardSkeleton() {
  return (
    <Card className="glass">
      <CardHeader>
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
        <div className="h-8 w-3/4 bg-muted animate-pulse rounded mt-2" />
      </CardHeader>
    </Card>
  )
}

