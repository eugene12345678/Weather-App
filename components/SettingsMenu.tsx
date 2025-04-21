'use client';

import React from 'react';
import { Settings2Icon, RefreshCwIcon, ThermometerIcon, SunIcon, MoonIcon, FullscreenIcon as ScreenIcon } from 'lucide-react';
import { useWeatherContext } from '@/context/WeatherContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function SettingsMenu() {
  const { 
    units, 
    setUnits, 
    updateInterval, 
    setUpdateInterval, 
    refreshWeather,
    theme,
    setTheme
  } = useWeatherContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="h-8 w-8 bg-background/60 backdrop-blur-md hover:bg-background/80 transition-all"
        >
          <Settings2Icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => refreshWeather()}>
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          <span>Refresh now</span>
        </DropdownMenuItem>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ThermometerIcon className="mr-2 h-4 w-4" />
            <span>Units</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <RadioGroup value={units} onValueChange={setUnits}>
                <DropdownMenuItem onClick={() => setUnits('metric')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="metric" id="metric" />
                    <Label htmlFor="metric">Metric (°C, km/h)</Label>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUnits('imperial')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="imperial" id="imperial" />
                    <Label htmlFor="imperial">Imperial (°F, mph)</Label>
                  </div>
                </DropdownMenuItem>
              </RadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            <span>Auto-refresh</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <RadioGroup value={updateInterval.toString()} onValueChange={(value) => setUpdateInterval(Number(value))}>
                <DropdownMenuItem onClick={() => setUpdateInterval(0)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="none" />
                    <Label htmlFor="none">Off</Label>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUpdateInterval(15)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="15" id="15min" />
                    <Label htmlFor="15min">Every 15 minutes</Label>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUpdateInterval(30)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30" id="30min" />
                    <Label htmlFor="30min">Every 30 minutes</Label>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setUpdateInterval(60)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="60" id="60min" />
                    <Label htmlFor="60min">Every hour</Label>
                  </div>
                </DropdownMenuItem>
              </RadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ScreenIcon className="mr-2 h-4 w-4" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <RadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="light" />
                    <SunIcon className="h-4 w-4 mr-1" />
                    <Label htmlFor="light">Light</Label>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="dark" />
                    <MoonIcon className="h-4 w-4 mr-1" />
                    <Label htmlFor="dark">Dark</Label>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="system" />
                    <ScreenIcon className="h-4 w-4 mr-1" />
                    <Label htmlFor="system">System</Label>
                  </div>
                </DropdownMenuItem>
              </RadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}