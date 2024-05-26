import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

import { Progress } from "@/components/ui/progress";

import axios from "@/api/axios";

export const Route = createFileRoute("/mark_appointment")({
  component: () => MarkAppointmentPage(),
});

function MarkAppointmentPage() {
  const [progress, setProgress] = useState<number>(0);
  const [selectedSpeciality, setSelectedSpeciality] = useState<string>("");
  const [tab, setTab] = useState<string>("speciality");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [date, setDate] = React.useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  const navigate = useNavigate();

  const onTabChange = (value: string) => {
    setTab(value);
  };

  const {
    data: specialities
  } = useQuery({
    queryKey: ["specialities"],
    queryFn: async () => {
      const res = await axios.get("/patient/speciality", {
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
    data: doctors
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const res = await axios.get(`/patient/medics?speciality=${selectedSpeciality}`, {
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
  } = useQuery({
    queryKey: ["availableSlots"],
    queryFn: async () => {
      const res = await axios.get(
        `/patient/medics/availability/${selectedDoctor}?day=${date?.getTime()}`,
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
        `/patient/appointments`,
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
    onSuccess: () => {
      setProgress(100);
      setTimeout(() => {
        navigate({ to: "/appointments" });
      }, 3000);
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
              <TabsTrigger value="speciality" className="grow bg-secondary">
                Speciality
              </TabsTrigger>
              <TabsTrigger value="doctor" className="grow bg-secondary ">
                Doctor
              </TabsTrigger>
              <TabsTrigger value="date" className="grow bg-secondary">
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
                }}
                value={selectedSpeciality}
              >
                <SelectTrigger id="selectSpeciality">
                  <SelectValue placeholder="Select a Speciality" />
                </SelectTrigger>
                <SelectContent defaultValue="Speciality">
                  <SelectGroup>
                    {
                      specialities?.map((speciality: string) => (
                        <SelectItem
                          id={speciality}
                          key={speciality}
                          value={speciality}
                          className="text-md"
                        >
                          {speciality}
                        </SelectItem>
                      ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                variant={"accent"}
                className="mt-4"
                onClick={() => {
                  onTabChange("doctor");
                  setProgress(33);
                }}
                id="goToStep2Btn"
              >
                Save and proceed to next step
              </Button>
            </TabsContent>
            <TabsContent value="doctor" className="space-y-4">
              <Label>Select a doctor in the given speciality</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedDoctor(value);
                }}
                value={selectedDoctor}
              >
                <SelectTrigger id="selectDoctor">
                  <SelectValue placeholder="Select a Doctor" />
                </SelectTrigger>
                <SelectContent defaultValue="Doctor">
                  <SelectGroup>
                    {
                      doctors?.map(
                        (
                          doctor // cba to make a Doctor type
                        ) => (
                          <SelectItem
                            id={doctor.id}
                            key={doctor.id}
                            value={doctor.id}
                            className="text-md"
                          >
                            {doctor.name}
                          </SelectItem>
                        )
                      )}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                variant={"accent"}
                className="mt-4"
                onClick={() => {
                  onTabChange("date");
                  setProgress(50);
                }}
                id="goToStep3Btn"
              >
                Save and proceed to next step
              </Button>
            </TabsContent>
            <TabsContent value="date" className="flex flex-row  justify-evenly">
              <div className="flex flex-col ">
                <Label className="text-2xl">Select the day</Label>
                <Calendar
                  mode="single"
                  onSelect={(date) => {
                    setProgress(66);
                    setDate(date);
                  }}
                  selected={date}
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
                        setProgress(83);
                      }}
                      value={selectedSlot}
                    >
                      <SelectTrigger id="selectHour">
                        <SelectValue placeholder="Select a Time Slot" />
                      </SelectTrigger>
                      <SelectContent defaultValue="Time Slot">
                        <SelectGroup>
                          {availableSlots.map((slot: string) => (
                            <SelectItem key={slot} value={slot} id={slot}>
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
                      variant={"accent"}
                      onClick={() => {
                        markAppointment.mutate();
                      }}
                      id="markButton"
                    >
                      Confirm Appointment
                    </Button>
                  )}

                {markAppointment.isSuccess && (
                  <Label className="text-green-500" id="confirmationText">
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
      <Progress className="mt-4" value={progress} />
    </main>
  );
}
