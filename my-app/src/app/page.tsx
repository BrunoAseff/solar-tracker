"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>();

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [dates, setDates] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [dayLength, setDayLength] = useState("");

  const handleClick = async () => {
    const splitDate = dates.split("/");
    const day = splitDate[0];
    const month = splitDate[1];
    const year = splitDate[2];

    try {
      const response = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=${year}-${month}-${day}`
      );
      const data = await response.json();
      setSunrise(data.results.sunrise);
      setSunset(data.results.sunset);
      setDayLength(data.results.day_length);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Latitude"
        />
        <input
          type="text"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="Longitude"
        />
        <input
          type="text"
          value={dates}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Data (DD/MM/YYYY)"
        />
        <button onClick={handleClick}>Consultar</button>
        <div>Nascer do sol: {sunrise}</div>
        <div>Pôr do sol: {sunset}</div>
        <div>Duração do dia: {dayLength}</div>
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePickerDemo;
