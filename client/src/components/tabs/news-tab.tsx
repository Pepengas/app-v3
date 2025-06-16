import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Megaphone, Calendar, Trophy } from "lucide-react";
import { format } from "date-fns";
import { el, enUS } from "date-fns/locale";
import type { NewsItem } from "@shared/schema";

export function NewsTab() {
  const { t, language } = useLanguage();
  
  const { data: news, isLoading, refetch } = useQuery<NewsItem[]>({
    queryKey: ["/api/news"],
  });

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "ακαδημαϊκά":
      case "academic":
        return <Megaphone className="h-4 w-4 text-white" />;
      case "εκδηλώσεις":
      case "events":
        return <Calendar className="h-4 w-4 text-white" />;
      case "επιτυχίες":
      case "achievements":
        return <Trophy className="h-4 w-4 text-white" />;
      default:
        return <Megaphone className="h-4 w-4 text-white" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "ακαδημαϊκά":
      case "academic":
        return "bg-primary";
      case "εκδηλώσεις":
      case "events":
        return "bg-secondary";
      case "επιτυχίες":
      case "achievements":
        return "bg-green-500";
      default:
        return "bg-primary";
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "d MMM yyyy", {
      locale: language === "el" ? el : enUS,
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="material-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium text-on-surface">{t("news.title")}</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          className="text-primary font-medium text-sm"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          {t("news.refresh")}
        </Button>
      </div>

      {!news || news.length === 0 ? (
        <Card className="material-shadow">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Newspaper className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-on-surface mb-2">{t("news.empty.title")}</h3>
            <p className="text-sm text-on-surface-variant">{t("news.empty.description")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <Card key={item.id} className="material-shadow border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getCategoryColor(item.category)}`}>
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-on-surface mb-2">
                      {item.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm mb-3">
                      {item.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-on-surface-variant">
                      <span>{formatDate(new Date(item.publishedAt))}</span>
                      <Badge className={`${getCategoryColor(item.category)} text-white px-2 py-1 rounded-full`}>
                        {item.category}
                      </Badge>
                    </div>
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
