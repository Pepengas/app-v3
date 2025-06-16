import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, GraduationCap, BookOpen, Mail, Calendar, Library, Link } from "lucide-react";
import type { QuickLink } from "@shared/schema";

export function LinksTab() {
  const { t } = useLanguage();

  const { data: links, isLoading } = useQuery<QuickLink[]>({
    queryKey: ["/api/links"],
  });

  const getIconByName = (iconName: string) => {
    switch (iconName) {
      case "GraduationCap":
        return <GraduationCap className="h-6 w-6 text-white" />;
      case "BookOpen":
        return <BookOpen className="h-6 w-6 text-white" />;
      case "Mail":
        return <Mail className="h-6 w-6 text-white" />;
      case "Calendar":
        return <Calendar className="h-6 w-6 text-white" />;
      case "Library":
        return <Library className="h-6 w-6 text-white" />;
      default:
        return <Link className="h-6 w-6 text-white" />;
    }
  };

  const handleLinkClick = (url: string, isExternal: boolean) => {
    if (isExternal) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = url;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <Skeleton className="h-7 w-40 mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="material-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="w-8 h-8 rounded-full" />
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
      <h2 className="text-xl font-medium text-on-surface mb-6">{t("links.title")}</h2>

      {!links || links.length === 0 ? (
        <Card className="material-shadow">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Link className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-on-surface mb-2">{t("links.empty.title")}</h3>
            <p className="text-sm text-on-surface-variant">{t("links.empty.description")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {links.map((link, index) => (
            <Card 
              key={link.id} 
              className="material-shadow card-hover stagger-animation"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center smooth-transition bounce-in ${link.color}`}>
                    {getIconByName(link.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-on-surface smooth-transition">{link.title}</h3>
                    <p className="text-on-surface-variant text-sm">{link.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleLinkClick(link.url, Boolean(link.isExternal))}
                    className="p-2 text-primary hover:bg-surface-variant smooth-transition hover:scale-110"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
