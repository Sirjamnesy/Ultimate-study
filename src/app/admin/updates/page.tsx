import Link from "next/link";
import { Plus } from "lucide-react";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { categoryLabel, type UpdateCategory } from "@/lib/data/updates";

export default async function AdminUpdatesPage() {
  const svc = await createServiceRoleClient();
  const { data: updates } = await svc
    .from("updates")
    .select("id, slug, title, category, published_at, updated_at")
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Updates</h2>
        <Link href="/admin/updates/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New update
          </Button>
        </Link>
      </div>

      {!updates || updates.length === 0 ? (
        <div className="sketch-card bg-card p-8 rounded-2xl text-center text-sm text-muted-foreground">
          No updates yet. Post your first announcement.
        </div>
      ) : (
        <div className="sketch-card bg-card rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {updates.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.title}</TableCell>
                  <TableCell className="text-muted-foreground">{categoryLabel(u.category as UpdateCategory)}</TableCell>
                  <TableCell>
                    <Badge variant={u.published_at ? "default" : "secondary"}>
                      {u.published_at && new Date(u.published_at) <= new Date() ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/updates/${u.id}/edit`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
