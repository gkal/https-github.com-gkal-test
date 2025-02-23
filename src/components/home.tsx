import React, { useState } from "react";
import DataEntryForm from "./DataEntryForm";
import { supabase } from "@/lib/supabase";
import ProfilesTable from "./ProfilesTable";

const Home = () => {
  const [shouldRefreshTable, setShouldRefreshTable] = useState(false);
  return (
    <div className="min-h-screen w-full bg-background p-4">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Employee Data Entry Form
          </h1>
          <p className="text-muted-foreground mt-2">
            Please fill out the form below with your information
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <DataEntryForm
            onSubmit={async (data) => {
              const { error } = await supabase.from("profiles").insert([
                {
                  ...data,
                  id: crypto.randomUUID(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                },
              ]);
              if (error) throw error;
              setShouldRefreshTable((prev) => !prev);
            }}
          />
          <ProfilesTable key={String(shouldRefreshTable)} autoRefresh={true} />
        </div>
      </div>
    </div>
  );
};

export default Home;
