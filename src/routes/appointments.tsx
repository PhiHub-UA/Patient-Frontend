import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "@/api/axios";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

export const Route = createFileRoute("/appointments")({
  beforeLoad: () => {
    console.log(
      "I cannot call hooks here so how do i see if user is logged in from store ;/"
    );
  },

  component: AppointmentsPage,
});

function AppointmentsPage() {

    const {data:appointments} = useQuery({
        queryKey: ["appointments"],
        queryFn: () => {
          axios.get("/appointments", 
          {
            headers: {
              Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined,
            },
          }
        ).then((res) => {
            return res.data.appointments;
          }).catch((err) => {
            console.log(err);
          });
          return null;
        }
      });

  return (
    <div className=" h-screen ">
      <h1 className="text-2xl text-primary mb-5 ">Appointments</h1>
      <section className="items-center flex flex-col gap-4 justify-center ">

    <Table>
        <TableHeader>
            <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {appointments && appointments.map(() => (
                <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
        

        </section>
    </div>
  );
}
