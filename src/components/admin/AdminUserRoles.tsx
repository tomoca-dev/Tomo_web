import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Shield, Trash2, Search, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AppRole = "admin" | "moderator" | "user";

interface UserRoleRow {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  display_name?: string;
}

interface ProfileRow {
  user_id: string;
  display_name: string | null;
}

export function AdminUserRoles() {
  const { toast } = useToast();

  const [roles, setRoles] = useState<UserRoleRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Search + assign
  const [lookup, setLookup] = useState("");
  const [searching, setSearching] = useState(false);
  const [matches, setMatches] = useState<ProfileRow[]>([]);
  const [assignRole, setAssignRole] = useState<AppRole>("admin");

  // Table search
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRoles = async () => {
    setLoading(true);

    const { data: rolesData, error: rolesError } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: false });

    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
      toast({
        title: "Error",
        description: rolesError.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Profiles are publicly viewable in your RLS, so we can map user_id -> display_name (defaults to email on signup)
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("user_id, display_name");

    if (profilesError) {
      console.warn("Could not fetch profiles:", profilesError);
    }

    const profilesMap = new Map(
      (profilesData ?? []).map((p) => [p.user_id, p.display_name])
    );

    const withNames: UserRoleRow[] = (rolesData ?? []).map((r: any) => ({
      ...r,
      display_name: profilesMap.get(r.user_id) ?? "Unknown user",
    }));

    setRoles(withNames);
    setLoading(false);
  };

  const searchUsers = async () => {
    const q = lookup.trim();
    if (!q) {
      setMatches([]);
      return;
    }

    setSearching(true);

    // display_name defaults to email in your signup trigger, so searching by email works.
    const pattern = `%${q}%`;
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id, display_name")
      .ilike("display_name", pattern)
      .order("created_at", { ascending: false })
      .limit(10);

    setSearching(false);

    if (error) {
      toast({
        title: "Search error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setMatches((data ?? []) as ProfileRow[]);
  };

  const handleAssign = async (userId: string, role: AppRole) => {
    const { error } = await supabase.from("user_roles").insert({
      user_id: userId,
      role,
    });

    if (error) {
      // Unique constraint violation is common if the role already exists
      const msg =
        error.code === "23505"
          ? "That user already has this role."
          : error.message;

      toast({
        title: "Could not assign role",
        description: msg,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Role assigned",
      description: `Assigned ${role} role.`,
    });

    await fetchRoles();
  };

  const handleRemoveRole = async (roleId: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", roleId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Removed",
      description: "Role removed successfully.",
    });

    await fetchRoles();
  };

  const filteredRoles = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return roles;
    return roles.filter((r) => {
      const name = (r.display_name ?? "").toLowerCase();
      return name.includes(q) || r.role.toLowerCase().includes(q);
    });
  }, [roles, filter]);

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "moderator":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Find user + assign role */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Assign Role
          </CardTitle>
          <CardDescription>
            Search a user by email/display name (users must sign up first), then assign a role.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Search by email or display name…"
              value={lookup}
              onChange={(e) => setLookup(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchUsers();
              }}
              className="flex-1"
            />
            <Select value={assignRole} onValueChange={(v: AppRole) => setAssignRole(v)}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={searchUsers} disabled={searching}>
              <Search className="w-4 h-4 mr-2" />
              {searching ? "Searching…" : "Search"}
            </Button>
          </div>

          {matches.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Matches</div>
              <div className="rounded-lg border border-border divide-y divide-border">
                {matches.map((m) => (
                  <div key={m.user_id} className="p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {m.display_name ?? "Unnamed user"}
                      </div>
                      <div className="text-xs text-muted-foreground break-all">
                        {m.user_id}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        onClick={() => handleAssign(m.user_id, assignRole)}
                      >
                        Assign {assignRole}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleAssign(m.user_id, "admin")}
                      >
                        Make admin
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                Tip: if you don’t see a user, they haven’t signed up yet, or their profile display name is different.
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Roles list */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                User Roles
              </CardTitle>
              <CardDescription>Manage permissions and access levels.</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Filter…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : filteredRoles.length === 0 ? (
            <div className="text-sm text-muted-foreground">No roles found.</div>
          ) : (
            <div className="space-y-3">
              {filteredRoles.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border border-border bg-background/40"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-medium truncate">{r.display_name}</div>
                      <Badge variant={getRoleBadgeVariant(r.role)}>{r.role}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground break-all">{r.user_id}</div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove role?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove the <b>{r.role}</b> role from <b>{r.display_name}</b>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRemoveRole(r.id)}>
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
