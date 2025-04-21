'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, MapPinIcon, XIcon } from 'lucide-react';
import { searchLocations } from '@/lib/api';
import { Location } from '@/types/weather';
import { useWeatherContext } from '@/context/WeatherContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { DialogTitle } from '@/components/ui/dialog';

export default function LocationSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { location, setLocation } = useWeatherContext();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSearch = async (value: string) => {
    setQuery(value);
    setError(null);
    
    if (value.trim().length > 1) {
      setLoading(true);
      try {
        const locations = await searchLocations(value);
        setResults(locations);
        if (locations.length === 0) {
          setError('No cities found. Try a different search term.');
        }
      } catch (error) {
        console.error('Error searching locations:', error);
        setError('Failed to search locations. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const handleSelectLocation = (location: Location) => {
    setLocation(location);
    setOpen(false);
    setQuery('');
    setError(null);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="px-2 h-8 md:h-9 text-xs md:text-sm flex items-center gap-1 bg-background/60 backdrop-blur-md hover:bg-background/80 transition-all"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-3.5 w-3.5 md:h-4 md:w-4" />
        <span className="hidden md:inline">Search location</span>
        <span className="hidden md:inline ml-1 text-xs text-muted-foreground">⌘K</span>
      </Button>
      
      {location && (
        <div className="flex items-center bg-background/60 backdrop-blur-md rounded-md px-2 py-1 text-xs md:text-sm">
          <MapPinIcon className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-primary" />
          <span>
            {location.name}
            {location.admin1 && `, ${location.admin1}`}
            {location.country && `, ${location.country}`}
          </span>
        </div>
      )}
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search Locations</DialogTitle>
        <CommandInput
          placeholder="Search cities..."
          value={query}
          onValueChange={handleSearch}
        />
        <CommandList>
          <CommandEmpty>
            {loading ? (
              'Searching...'
            ) : error ? (
              <span className="text-destructive">{error}</span>
            ) : (
              'Start typing to search for cities...'
            )}
          </CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Results">
              {results.map((location) => (
                <CommandItem
                  key={`${location.id}-${location.name}`}
                  onSelect={() => handleSelectLocation(location)}
                >
                  <MapPinIcon className="mr-2 h-4 w-4" />
                  <span>
                    {location.name}
                    {location.admin1 && `, ${location.admin1}`}
                    {location.country && `, ${location.country}`}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  );
}