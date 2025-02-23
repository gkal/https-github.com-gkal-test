import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfilesTableProps {
  autoRefresh?: boolean;
}

export default function ProfilesTable({
  autoRefresh = true,
}: ProfilesTableProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (autoRefresh) {
      fetchProfiles();
    }
  }, [autoRefresh]);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <Button
        onClick={fetchProfiles}
        disabled={loading}
        className="w-full md:w-auto"
      >
        {loading ? "Loading..." : "Show All Profiles"}
      </Button>

      {profiles.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.full_name}</TableCell>
                  <TableCell>{profile.username}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>{profile.department}</TableCell>
                  <TableCell>{profile.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
