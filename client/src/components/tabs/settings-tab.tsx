import { useQuery, useMutation } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Languages, 
  Bell, 
  Settings as SettingsIcon, 
  LifeBuoy, 
  Trash2, 
  RefreshCw, 
  Info,
  MessageSquare,
  Bug
} from "lucide-react";
import type { Settings } from "@shared/schema";

export function SettingsTab() {
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (newSettings: Partial<Settings>) => 
      apiRequest("PATCH", "/api/settings", newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({
        title: t("settings.updated"),
        description: t("settings.updatedDescription"),
      });
    },
    onError: () => {
      toast({
        title: t("settings.error"),
        description: t("settings.errorDescription"),
        variant: "destructive",
      });
    },
  });

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    updateSettingsMutation.mutate({ language: newLanguage });
  };

  const handleNotificationToggle = (type: string, value: boolean) => {
    const update = { [type]: value };
    updateSettingsMutation.mutate(update);
  };

  const handleClearCache = () => {
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }
    localStorage.clear();
    sessionStorage.clear();
    toast({
      title: t("settings.cache.cleared"),
      description: t("settings.cache.clearedDescription"),
    });
  };

  const handleCheckUpdates = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update();
        }
      });
    }
    toast({
      title: t("settings.updates.checking"),
      description: t("settings.updates.checkingDescription"),
    });
  };

  const handleSendFeedback = () => {
    const subject = encodeURIComponent(t("settings.feedback.subject"));
    const body = encodeURIComponent(t("settings.feedback.body"));
    window.open(`mailto:support@hmu.gr?subject=${subject}&body=${body}`, "_blank");
  };

  const handleReportBug = () => {
    const subject = encodeURIComponent(t("settings.bug.subject"));
    const body = encodeURIComponent(t("settings.bug.body"));
    window.open(`mailto:support@hmu.gr?subject=${subject}&body=${body}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-7 w-24 mb-6" />
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="material-shadow">
              <CardContent className="p-4">
                <div className="flex items-center mb-4">
                  <Skeleton className="w-5 h-5 mr-3" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
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
      <h2 className="text-xl font-medium text-on-surface mb-6">{t("settings.title")}</h2>

      <div className="space-y-6">
        {/* Language Settings */}
        <Card className="material-shadow">
          <CardContent className="p-4">
            <h3 className="font-medium text-on-surface mb-4 flex items-center">
              <Languages className="text-primary mr-3 h-5 w-5" />
              {t("settings.language.title")}
            </h3>
            <RadioGroup
              value={language}
              onValueChange={handleLanguageChange}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="el" id="lang-el" />
                <Label htmlFor="lang-el" className="text-on-surface">
                  {t("settings.language.greek")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="lang-en" />
                <Label htmlFor="lang-en" className="text-on-surface">
                  {t("settings.language.english")}
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="material-shadow">
          <CardContent className="p-4">
            <h3 className="font-medium text-on-surface mb-4 flex items-center">
              <Bell className="text-primary mr-3 h-5 w-5" />
              {t("settings.notifications.title")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="news-notifications" className="text-on-surface">
                  {t("settings.notifications.news")}
                </Label>
                <Switch
                  id="news-notifications"
                  checked={settings?.newsNotifications || false}
                  onCheckedChange={(checked) => 
                    handleNotificationToggle("newsNotifications", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="grades-notifications" className="text-on-surface">
                  {t("settings.notifications.grades")}
                </Label>
                <Switch
                  id="grades-notifications"
                  checked={settings?.gradesNotifications || false}
                  onCheckedChange={(checked) => 
                    handleNotificationToggle("gradesNotifications", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="events-notifications" className="text-on-surface">
                  {t("settings.notifications.events")}
                </Label>
                <Switch
                  id="events-notifications"
                  checked={settings?.eventsNotifications || false}
                  onCheckedChange={(checked) => 
                    handleNotificationToggle("eventsNotifications", checked)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card className="material-shadow">
          <CardContent className="p-4">
            <h3 className="font-medium text-on-surface mb-4 flex items-center">
              <SettingsIcon className="text-primary mr-3 h-5 w-5" />
              {t("settings.app.title")}
            </h3>
            <div className="space-y-3">
              <Button
                variant="ghost"
                onClick={handleClearCache}
                className="w-full justify-between p-3 h-auto"
              >
                <span className="text-on-surface">{t("settings.app.clearCache")}</span>
                <Trash2 className="h-4 w-4 text-on-surface-variant" />
              </Button>
              <Separator />
              <Button
                variant="ghost"
                onClick={handleCheckUpdates}
                className="w-full justify-between p-3 h-auto"
              >
                <span className="text-on-surface">{t("settings.app.checkUpdates")}</span>
                <RefreshCw className="h-4 w-4 text-on-surface-variant" />
              </Button>
              <Separator />
              <Button
                variant="ghost"
                className="w-full justify-between p-3 h-auto"
              >
                <span className="text-on-surface">{t("settings.app.about")}</span>
                <Info className="h-4 w-4 text-on-surface-variant" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="material-shadow">
          <CardContent className="p-4">
            <h3 className="font-medium text-on-surface mb-4 flex items-center">
              <LifeBuoy className="text-primary mr-3 h-5 w-5" />
              {t("settings.support.title")}
            </h3>
            <div className="space-y-3">
              <Button
                variant="ghost"
                onClick={handleSendFeedback}
                className="w-full justify-between p-3 h-auto"
              >
                <span className="text-on-surface">{t("settings.support.feedback")}</span>
                <MessageSquare className="h-4 w-4 text-on-surface-variant" />
              </Button>
              <Separator />
              <Button
                variant="ghost"
                onClick={handleReportBug}
                className="w-full justify-between p-3 h-auto"
              >
                <span className="text-on-surface">{t("settings.support.reportBug")}</span>
                <Bug className="h-4 w-4 text-on-surface-variant" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
