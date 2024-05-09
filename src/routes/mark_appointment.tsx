
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "@/api/axios";

export const Route = createFileRoute("/mark_appointment")({
  component: () => MarkAppointmentPage(),
});

function MarkAppointmentPage() {
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>("");
  const [tab, setTab] = useState<string>("speciality");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [date, setDate] = React.useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const onTabChange = (value: string) => {
    setTab(value);
  };

  const {
    data: specialities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["specialities"],
    queryFn: async () => {
      const res = await axios.get("/speciality", {
        headers: {
          Authorization: localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : undefined,
        },
      });
      return res.data;
    },
  });

  const {
    data: doctors,
    isLoading: doctorsIsLoading,
    error: doctorsError,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await axios.get(`/medic?speciality=${selectedSpeciality}`, {
        headers: {
          Authorization: localStorage.getItem("token")
            ? `Bearer ${localStorage.getItem("token")}`
            : undefined,
        },
      });
      console.log(res.data);
      return res.data;
    },
    enabled: selectedSpeciality !== "" && tab === "doctor",
  });

  const {
    data: availableSlots,
    isLoading: availableSlotsIsLoading,
    error: availableSlotsError,
  } = useQuery({
    queryKey: ["availableSlots"],
    queryFn: async () => {
      const res = await axios.get(
        `/medic/availability/${selectedDoctor}?day=${date?.getTime()}`,
        {
          headers: {
            Authorization: localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : undefined,
          },
        }
      );
      return res.data;
    },
    enabled: selectedDoctor !== "" && tab === "date" && date !== undefined,
  });

  const markAppointment = useMutation({
    mutationFn: async () => {
      date?.setHours(parseInt(selectedSlot.split(":")[0]));
      date?.setMinutes(parseInt(selectedSlot.split(":")[1]));

      const res = await axios.post(
        `/appointments`,
        {
          medicID: selectedDoctor,
          speciality: selectedSpeciality,
          price: 50.0,
          date: date?.getTime(),
        },
        {
          headers: {
            Authorization: localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : undefined,
          },
        }
      );
      console.log(res.data);
      return res.data;
    },
  });

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-gradient-to-b from-background to-blue-300">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-center">Mark Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={onTabChange}>
            <TabsList className="flex justify-evenly mb-8">
              <TabsTrigger value="speciality" className="grow">
                Speciality
              </TabsTrigger>
              <TabsTrigger disabled={true} value="doctor" className="grow">
                Doctor
              </TabsTrigger>
              <TabsTrigger disabled={true} value="date" className="grow">
                Date
              </TabsTrigger>
            </TabsList>
            <TabsContent value="speciality" className="space-y-4">
              <Label>
                Select the speciality in which you seek a consultation
              </Label>
              <Select
                onValueChange={(value) => {
                  setSelectedSpeciality(value);
                  console.log(value);
                }}
                value={selectedSpeciality}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Speciality" />
                </SelectTrigger>
                <SelectContent defaultValue="Speciality">
                  <SelectGroup className="capitalize">
                    {specialities &&
                      specialities.map((speciality: string) => (
                        <SelectItem
                          key={speciality}
                          value={speciality}
                          className="capitalize"
                        >
                          {speciality}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                className="mt-4"
                onClick={() => {
                  onTabChange("doctor");
                }}
              >
                Save and proceed to next step
              </Button>
            </TabsContent>
            <TabsContent value="doctor" className="space-y-4">
              <Label>Select a doctor in the given speciality</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedDoctor(value);
                  console.log(value);
                }}
                value={selectedDoctor}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a Doctor" />
                </SelectTrigger>
                <SelectContent defaultValue="Doctor">
                  <SelectGroup>
                    {doctors &&
                      doctors.map(
                        (
                          doctor // cba to make a Doctor type
                        ) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            {doctor.name}
                          </SelectItem>
                        )
                      )}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                className="mt-4"
                onClick={() => {
                  onTabChange("date");
                }}
              >
                Save and proceed to next step
              </Button>
            </TabsContent>
            <TabsContent value="date" className="flex flex-row  justify-evenly">
              <div className="flex flex-col ">
                <Label className="text-2xl">Select the day</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </div>
              <div className="flex flex-col space-y-2 mb-8">
                <Label className="text-2xl">Check medic availability</Label>
                {availableSlots && (
                  <div>
                    <Label>Select a time slot</Label>
                    <Select
                      onValueChange={(value) => {
                        setSelectedSlot(value);
                      }}
                      value={selectedSlot}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Time Slot" />
                      </SelectTrigger>
                      <SelectContent defaultValue="Time Slot">
                        <SelectGroup>
                          {availableSlots.map((slot: string) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2 mb-8">
                <Label className="text-2xl">Confirm your appointment</Label>
                {date &&
                  selectedSlot &&
                  selectedDoctor &&
                  selectedSpeciality && (
                    <Button
                      onClick={() => {
                        markAppointment.mutate();
                      }}
                    >
                      Confirm Appointment
                    </Button>
                  )}

                {markAppointment.isSuccess && (
                  <Label className="text-green-500">
                    Appointment marked successfully
                  </Label>
                )}
                {markAppointment.isError && (
                  <Label className="text-red-500">
                    Error marking appointment : {markAppointment.error}
                  </Label>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}