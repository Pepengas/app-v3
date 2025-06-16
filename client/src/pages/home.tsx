import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { NewsTab } from "@/components/tabs/news-tab";
import { TeachersTab } from "@/components/tabs/teachers-tab";
import { LinksTab } from "@/components/tabs/links-tab";
import { MapTab } from "@/components/tabs/map-tab";
import { SettingsTab } from "@/components/tabs/settings-tab";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [activeTab, setActiveTab] = useState("news");
  const { t } = useLanguage();
  const { toast } = useToast();

  // Sync data from all endpoints
  const { refetch: refetchNews } = useQuery({
    queryKey: ["/api/news"],
    enabled: false,
  });

  const { refetch: refetchTeachers } = useQuery({
    queryKey: ["/api/teachers"],
    enabled: false,
  });

  const { refetch: refetchLinks } = useQuery({
    queryKey: ["/api/links"],
    enabled: false,
  });

  const { refetch: refetchBuildings } = useQuery({
    queryKey: ["/api/buildings"],
    enabled: false,
  });

  const handleSyncData = async () => {
    try {
      await Promise.all([
        refetchNews(),
        refetchTeachers(),
        refetchLinks(),
        refetchBuildings(),
      ]);
      toast({
        title: t("sync.success"),
        description: t("sync.successDescription"),
      });
    } catch (error) {
      toast({
        title: t("sync.error"),
        description: t("sync.errorDescription"),
        variant: "destructive",
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "news":
        return <NewsTab />;
      case "teachers":
        return <TeachersTab />;
      case "links":
        return <LinksTab />;
      case "map":
        return <MapTab />;
      case "settings":
        return <SettingsTab />;
      default:
        return <NewsTab />;
    }
  };

  return (
    <div className="mx-auto bg-surface min-h-screen relative max-w-md">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-3 material-shadow sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-foreground rounded-full flex items-center justify-center">
              <span className="text-primary text-lg">🎓</span>
            </div>
            <h1 className="text-lg font-medium">{t("app.title")}</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-primary-dark transition-colors text-primary-foreground"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full"></span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 min-h-[calc(100vh-120px)]">
        {renderTabContent()}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Floating Action Button */}
      <Button
        onClick={handleSyncData}
        className="floating-action fixed bottom-24 right-6 w-14 h-14 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-full material-shadow-lg"
        size="icon"
      >
        <RefreshCw className="h-5 w-5" />
      </Button>
    </div>
  );
}
