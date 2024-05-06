import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "@/api/axios";
import { DataTable } from "@/components/ui/data-table";
import React from "react";

export const Route = createFileRoute("/appointments")({
  beforeLoad: () => {
    console.log(
      "I cannot call hooks here so how do i see if user is logged in from store ;/"
    );
  },

  component: AppointmentsPage,
});

function AppointmentsPage() {
  const { data: appointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: () =>
      axios
        .get("/appointments", {
          headers: {
            Authorization: localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : undefined,
          },
        })
        .then((res) => res.data),
  });

  return (
    <div className=" h-screen ">
      <h1 className="text-2xl text-primary mb-5 items-center justify-center ">Appointments</h1>
      <section className="items-center flex flex-col gap-4 justify-center ">
        {appointments && appointments.length > 0 ? (


          <DataTable
            columns={[
              {
                header: "Date",
                accessorFn : (row) => new Date(row.date).toLocaleString(),
              },
              {
                header: "Price",
                accessorFn : (row) => row.price +"€",

              },
              {
                header: "Patient",
                accessorKey: "patient.username",

              },
              {
                header: "Medic",
                accessorKey: "medic.name",

              },
              {
                header: "Speciality",
                accessorKey: "speciality",

              },
            ]}
            data={appointments}
          />
        ) : (
          <div>No appointments available</div>
        )}

        {/* {
        "id": 1,
        "date": 1714406400000,
        "price": 50.0,
        "patient": {
            "id": 1,
            "name": null,
            "phone": "123456788",
            "email": "rodrigoaguiar692@hotmail.com",
            "age": 12,
            "username": "dumbassdumbass",
            "role": "user"
        },
        "medic": {
            "id": 1,
            "name": "fodasse",
            "specialities": [
                "CARDIOLOGY",
                "DERMATOLOGY",
                null
            ]
        },
        "speciality": "DERMATOLOGY",
        "bill": null
    } */}
      </section>
    </div>
  );
}
