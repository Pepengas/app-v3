import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Info, Users } from "lucide-react";
import type { Teacher } from "@shared/schema";

export function TeachersTab() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const { data: teachers, isLoading } = useQuery<Teacher[]>({
    queryKey: ["/api/teachers", { search: searchQuery, department: selectedDepartment === "all" ? undefined : selectedDepartment }],
  });

  const departments = [
    { id: "all", label: t("teachers.departments.all") },
    { id: "Πληροφορική", label: t("teachers.departments.cs") },
    { id: "Μαθηματικά", label: t("teachers.departments.math") },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getInitialsColor = (name: string) => {
    const colors = ["bg-primary", "bg-secondary", "bg-green-500", "bg-purple-500", "bg-orange-500"];
    const index = name.length % colors.length;
    return colors[index];
  };

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full" />
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="material-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-on-surface">{t("teachers.title")}</h2>
        <div className="relative">
          <Input
            type="text"
            placeholder={t("teachers.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-48"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Department Filter */}
      <div className="flex overflow-x-auto space-x-2 mb-6 pb-2">
        {departments.map((dept) => (
          <Button
            key={dept.id}
            variant={selectedDepartment === dept.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDepartment(dept.id)}
            className="whitespace-nowrap"
          >
            {dept.label}
          </Button>
        ))}
      </div>

      {!teachers || teachers.length === 0 ? (
        <Card className="material-shadow">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-on-surface mb-2">{t("teachers.empty.title")}</h3>
            <p className="text-sm text-on-surface-variant">{t("teachers.empty.description")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="material-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium ${getInitialsColor(teacher.name)}`}>
                    {getInitials(teacher.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-on-surface">{teacher.name}</h3>
                    <p className="text-on-surface-variant text-sm">{teacher.department}</p>
                    {teacher.specialization && (
                      <p className="text-on-surface-variant text-xs mt-1">{teacher.specialization}</p>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEmailClick(teacher.email)}
                      className="p-2 text-primary hover:bg-surface-variant"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2 text-primary hover:bg-surface-variant"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
