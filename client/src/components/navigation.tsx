import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { 
  Newspaper, 
  Users, 
  Link, 
  Map, 
  Settings 
} from "lucide-react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { t } = useLanguage();

  const tabs = [
    { id: "news", label: t("nav.news"), icon: Newspaper },
    { id: "teachers", label: t("nav.teachers"), icon: Users },
    { id: "links", label: t("nav.links"), icon: Link },
    { id: "map", label: t("nav.map"), icon: Map },
    { id: "settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-surface material-shadow-lg border-t border-border">
      <div className="flex items-center justify-around py-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant="ghost"
            size="sm"
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeTab === id
                ? "text-primary bg-primary/10"
                : "text-on-surface-variant hover:bg-accent"
            }`}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
