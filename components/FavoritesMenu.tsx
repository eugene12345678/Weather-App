'use client';

import React, { useState } from 'react';
import { HeartIcon, StarIcon, XCircleIcon } from 'lucide-react';
import { useWeatherContext } from '@/context/WeatherContext';
import { Location } from '@/types/weather';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function FavoritesMenu() {
  const { 
    location, 
    setLocation, 
    favorites, 
    addFavorite, 
    removeFavorite, 
    isFavorite 
  } = useWeatherContext();
  
  const currentIsFavorite = location ? isFavorite(location.id) : false;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!location) return;
    
    if (currentIsFavorite) {
      removeFavorite(location.id);
    } else {
      addFavorite(location);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-full transition-all",
          currentIsFavorite && "text-yellow-500 dark:text-yellow-400"
        )}
        onClick={handleToggleFavorite}
        disabled={!location}
      >
        <StarIcon className="h-5 w-5" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 bg-background/60 backdrop-blur-md hover:bg-background/80 transition-all"
          >
            <HeartIcon className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Favorites</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          {favorites.length === 0 ? (
            <div className="py-6 text-center">
              <StarIcon className="mx-auto h-6 w-6 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No favorite locations yet</p>
            </div>
          ) : (
            favorites.map((favorite) => (
              <DropdownMenuItem 
                key={favorite.id}
                className="flex justify-between cursor-pointer"
                onClick={() => setLocation(favorite)}
              >
                <span className="truncate">
                  {favorite.name}
                  {favorite.admin1 && `, ${favorite.admin1}`}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(favorite.id);
                  }}
                >
                  <XCircleIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}