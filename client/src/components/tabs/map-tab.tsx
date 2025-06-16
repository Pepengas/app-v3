import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, FlaskRound, BookOpen, Navigation, MapPin } from "lucide-react";
import type { CampusBuilding } from "@shared/schema";

export function MapTab() {
  const { t } = useLanguage();
  const [selectedBuilding, setSelectedBuilding] = useState<CampusBuilding | null>(null);

  const { data: buildings, isLoading } = useQuery<CampusBuilding[]>({
    queryKey: ["/api/buildings"],
  });

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (typeof window !== "undefined" && !window.L) {
        const L = await import("leaflet");
        window.L = L.default;
      }
    };
    loadLeaflet();
  }, []);

  const getBuildingIcon = (buildingType: string) => {
    switch (buildingType.toLowerCase()) {
      case "main":
      case "κεντρικό":
        return <Building className="h-4 w-4 text-white" />;
      case "lab":
      case "εργαστήριο":
        return <FlaskRound className="h-4 w-4 text-white" />;
      case "library":
      case "βιβλιοθήκη":
        return <BookOpen className="h-4 w-4 text-white" />;
      default:
        return <Building className="h-4 w-4 text-white" />;
    }
  };

  const getBuildingColor = (buildingType: string) => {
    switch (buildingType.toLowerCase()) {
      case "main":
      case "κεντρικό":
        return "bg-primary";
      case "lab":
      case "εργαστήριο":
        return "bg-secondary";
      case "library":
      case "βιβλιοθήκη":
        return "bg-green-500";
      default:
        return "bg-primary";
    }
  };

  const handleGetDirections = (building: CampusBuilding) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${building.latitude},${building.longitude}`;
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-96 w-full" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-6 w-40" />
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="material-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="w-8 h-8" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Map Container */}
      <div className="h-96 bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 relative">
        {/* Map overlay info */}
        <div className="absolute top-4 left-4 bg-white rounded-lg material-shadow p-3 z-10">
          <h3 className="font-medium text-sm text-on-surface mb-1">{t("map.title")}</h3>
          <p className="text-xs text-on-surface-variant">{t("map.instruction")}</p>
        </div>

        {/* Building markers */}
        {buildings?.map((building, index) => (
          <button
            key={building.id}
            onClick={() => setSelectedBuilding(building)}
            className={`absolute w-8 h-8 rounded-lg material-shadow flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform ${getBuildingColor(building.buildingType)}`}
            style={{
              top: `${20 + index * 60}px`,
              left: `${60 + index * 40}px`,
            }}
          >
            {getBuildingIcon(building.buildingType)}
          </button>
        ))}

        {/* Selected building info */}
        {selectedBuilding && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg material-shadow p-3">
            <h4 className="font-medium text-on-surface">{selectedBuilding.name}</h4>
            <p className="text-sm text-on-surface-variant">{selectedBuilding.description}</p>
            <Button
              size="sm"
              onClick={() => handleGetDirections(selectedBuilding)}
              className="mt-2"
            >
              <Navigation className="h-3 w-3 mr-1" />
              {t("map.getDirections")}
            </Button>
          </div>
        )}
      </div>

      {/* Building List */}
      <div className="p-4 space-y-3">
        <h3 className="font-medium text-on-surface mb-4">{t("map.buildingsTitle")}</h3>

        {!buildings || buildings.length === 0 ? (
          <Card className="material-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-on-surface mb-2">{t("map.empty.title")}</h3>
              <p className="text-sm text-on-surface-variant">{t("map.empty.description")}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {buildings.map((building) => (
              <Card key={building.id} className="material-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getBuildingColor(building.buildingType)}`}>
                      {getBuildingIcon(building.buildingType)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-on-surface">{building.name}</h4>
                      <p className="text-on-surface-variant text-sm">{building.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleGetDirections(building)}
                      className="text-primary p-2"
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
