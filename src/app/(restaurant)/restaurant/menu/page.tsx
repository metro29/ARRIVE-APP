import { Package } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const placeholderPackages = [
  { title: "Executive Dinner", price: "$85 / guest", status: "Draft" },
  { title: "Celebration Package", price: "$120 / guest", status: "Draft" },
];

export default function RestaurantMenuPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Event packages"
        description="Structure for event_packages — full CRUD ships in Phase 2."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {placeholderPackages.map((pkg) => (
          <Card key={pkg.title}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{pkg.title}</CardTitle>
              <Badge variant="outline">{pkg.status}</Badge>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {pkg.price}
            </CardContent>
          </Card>
        ))}
        <Card className="flex flex-col items-center justify-center border-dashed py-12">
          <Package className="mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Package builder coming soon
          </p>
        </Card>
      </div>
    </div>
  );
}
