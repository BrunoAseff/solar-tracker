"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import { Card } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Home() {
  const [date, setDate] = React.useState<Date>();

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [dates, setDates] = useState("");
  const [sunrise, setSunrise] = useState("");
  const [sunset, setSunset] = useState("");
  const [dayLength, setDayLength] = useState("");

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = format(selectedDate, "dd/MM/yyyy");
      setDates(formattedDate);
      setDate(selectedDate);
    } else {
      console.log("Nenhuma data selecionada");
    }
  };

  const handleClick = async () => {
    const splitDate = dates.split("/");
    const day = splitDate[0];
    const month = splitDate[1];
    const year = splitDate[2];

    try {
      const response = await fetch(
        `https://api.sunrisesunset.io/json?lat=${lat}&lng=${lng}&timezone=UTC&date=${year}-${month}-${day}`
      );

      const data = await response.json();
      setSunrise(data.results.first_light);
      setSunset(data.results.last_light);
      setDayLength(data.results.day_length);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div
      className="flex flex-col h-screen justify-center items-center"
      style={{ background: "linear-gradient(to right, #f3904f, #3b4371)" }}
    >
      <Card className="grid gap-10 mx-auto w-1/3 items-center p-4">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Rastreador Solar
        </h1>
        <p className="text-base text-center">
          É só escolher a latitude, longitude e uma data
        </p>

        <div>
          <Input
            className="mt-4"
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
          />
          <Input
            className="mt-4"
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal mr-10",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : "Escolha uma data"}{" "}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 mt-2">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button className="mt-4 grid-cols-1 " onClick={handleClick}>
            Consultar
          </Button>

          <div className="flex flex-col items-center mt-8">
            <div className="flex justify-between w-full">
              <div>Nascer do sol:</div>
              <div>{sunrise}</div>
            </div>
            <div className="flex justify-between w-full">
              <div>Pôr do sol:</div>
              <div>{sunset}</div>
            </div>
            <div className="flex justify-between w-full">
              <div>Duração do dia:</div>
              <div>{dayLength}</div>
            </div>
          </div>
        </div>
      </Card>

      <a href="SunriseSunset.io" target="_blank" className="mt-4">
        Powered by SunriseSunset.io
      </a>
    </div>
  );
}

export { Home as default };
