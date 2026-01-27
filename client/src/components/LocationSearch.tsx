import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, MapPin, Phone, Navigation, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { serviceLocations, findNearestLocations, searchLocationsByText, getFullAddress, getDirectionsUrl, type ServiceLocation } from "@shared/locations";

const PHONE_NUMBER = "1-844-844-4070";
const PHONE_HREF = "tel:+18448444070";

interface LocationSearchProps {
  variant?: "hero" | "compact";
  className?: string;
}

export function LocationSearch({ variant = "hero", className = "" }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Array<ServiceLocation & { distance?: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setHasSearched(true);
    setErrorMessage(null);

    const textResults = searchLocationsByText(searchQuery);
    
    if (textResults.length > 0) {
      setResults(textResults.slice(0, 3));
      setIsSearching(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=us&limit=1`,
        {
          headers: {
            'User-Agent': 'AffordableGolfCartService/1.0'
          }
        }
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const nearestLocations = findNearestLocations(parseFloat(lat), parseFloat(lon), 3);
        setResults(nearestLocations);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setErrorMessage("Unable to search. Please try again or enter a different location.");
      setResults([]);
    }
    
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser. Please enter your address or zip code instead.");
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearestLocations = findNearestLocations(latitude, longitude, 3);
        setResults(nearestLocations);
        setIsSearching(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setErrorMessage("Unable to get your location. Please enter your address or zip code instead.");
        setIsSearching(false);
      }
    );
  };

  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter zip code or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-9"
              data-testid="input-location-search-compact"
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching} data-testid="button-search-location-compact">
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find"}
          </Button>
        </div>
        
        {hasSearched && !isSearching && (
          <div className="mt-3 space-y-2">
            {results.length > 0 ? (
              results.map((location) => (
                <Link key={location.id} href={`/locations/${location.slug}`}>
                  <div className="flex items-start gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer">
                    <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{location.city}, {location.stateAbbr}</p>
                      <p className="text-xs text-muted-foreground truncate">{getFullAddress(location)}</p>
                      {location.distance !== undefined && (
                        <p className="text-xs text-primary">{location.distance.toFixed(1)} miles away</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">
                No locations found. Call us at <a href={PHONE_HREF} className="text-primary font-medium">{PHONE_NUMBER}</a>
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter your zip code, city, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-12 h-12 text-base"
              data-testid="input-location-search"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              size="lg" 
              onClick={handleSearch} 
              disabled={isSearching}
              className="h-12"
              data-testid="button-search-location"
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : (
                <Search className="h-5 w-5 mr-2" />
              )}
              Find Location
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleUseMyLocation}
              disabled={isSearching}
              className="h-12"
              data-testid="button-use-my-location"
            >
              <Navigation className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Use My Location</span>
              <span className="sm:hidden">GPS</span>
            </Button>
          </div>
        </div>

        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {hasSearched && !isSearching && !errorMessage && (
          <div className="mt-6">
            {results.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-3">
                {results.map((location, index) => (
                  <Card 
                    key={location.id} 
                    className={`hover-elevate transition-all ${index === 0 ? "ring-2 ring-primary" : ""}`}
                    data-testid={`card-location-result-${location.slug}`}
                  >
                    <CardContent className="p-4">
                      {index === 0 && (
                        <span className="inline-block text-xs font-semibold text-primary mb-2">
                          Nearest Location
                        </span>
                      )}
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <h3 className="font-semibold text-foreground">{location.city}, {location.stateAbbr}</h3>
                          <p className="text-sm text-muted-foreground">{getFullAddress(location)}</p>
                          {location.distance !== undefined && (
                            <p className="text-sm font-medium text-primary mt-1">
                              {location.distance.toFixed(1)} miles away
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <a 
                          href={`tel:${location.phone.replace(/-/g, '')}`}
                          className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          {location.phone}
                        </a>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" asChild className="flex-1">
                            <a href={getDirectionsUrl(location)} target="_blank" rel="noopener noreferrer">
                              <Navigation className="h-4 w-4 mr-1" />
                              Directions
                            </a>
                          </Button>
                          <Button size="sm" asChild className="flex-1">
                            <Link href={`/locations/${location.slug}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No Nearby Locations Found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find a service location near that address. Don't worry - we still serve your area!
                  </p>
                  <Button asChild>
                    <a href={PHONE_HREF}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call {PHONE_NUMBER} for Service
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <div className="mt-4 text-center">
              <Link href="/locations" className="text-sm text-primary hover:underline" data-testid="link-view-all-locations">
                View All {serviceLocations.length} Service Locations
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
