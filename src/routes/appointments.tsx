import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/api/axios";
import React from "react";

import  {Button} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


export const Route = createFileRoute("/appointments")({
  beforeLoad: () => {
    console.log(
      "I cannot call hooks here so how do i see if user is logged in from store ;/"
    );
  },

  component: AppointmentsPage,
});

function AppointmentsPage() {

  const queryClient = useQueryClient();

  const [showDialog, setShowDialog] = React.useState(false);

  const { data: appointments } = useQuery({
    queryKey: ["appointments"],
    queryFn: () =>
      axios
        .get("/patient/appointments", {
          headers: {
            Authorization: localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : undefined,
          },
        })
        .then((res) => {console.log(res.data); return res.data}),

  });


  const postTicket = useMutation({
    mutationKey: ["postTicket"],
    mutationFn: (ticketID : number) =>
      axios
        .post("/patient/tickets", {appointmentId: ticketID, priority:false }, {
          headers: {
            Authorization: localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : undefined,
          },
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
      setShowDialog(true);

    }
  });

  const deleteTicket = useMutation({
    mutationKey: ["deleteTicket"],
    mutationFn: (appointmentID : number) =>
      axios
        .delete(`/patient/appointments/${appointmentID}`, {
          headers: {
            Authorization: localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : undefined,
          },
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments"]);
    }
  });



  return (
    <div className=" h-screen ">

      <h1 className="text-2xl text-primary mb-5 items-center justify-center ">Appointments</h1>
      <section className="items-center flex flex-col gap-4 justify-center ">
        {appointments && appointments.length > 0 ? (

          <table className="table table-xs">

            <thead>
              <tr>
                <th>Date</th>
                <th>Price</th>
                <th>Patient</th>
                <th>Medic</th>
                <th>Speciality</th>
                <th>Status</th>
                <th>Cancel</th>
                <th>Check In</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment : any) => (
                <tr key={appointment.id}>
                  <td>{new Date(appointment.date).toLocaleString()}</td>
                  <td>{appointment.price}€</td>
                  <td>{appointment.patient.username}</td>
                  <td>{appointment.medic.name}</td>
                  <td>{appointment.speciality}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <Button
                      variant="destructive"
                      className="text-md"
                      onClick={() => deleteTicket.mutate( appointment.id )}
                    >
                      Cancel
                    </Button>
                  </td>
                  {appointment && new Date().getTime() - 60*1000*200 < new Date(appointment.date).getTime() && appointment.state=="PENDING" && (
                    <td>
                      <Button
                        className="btn btn-sm btn-primary"
                        onClick={() => postTicket.mutate( appointment.id )}
                      >
                        Check In
                      </Button>
                    </td>
                  )} 
                  {appointment.state=="CHECKED_IN" && <td><Button variant="ghost" disabled={true}> Already Checked In </Button></td>}
                  {appointment.state=="FINISHED" && <td><Button variant="ghost" disabled={true}></Button></td>}
                </tr>
              ))}
            </tbody>

            

          </table>
        ) : (
          <div>No appointments available</div>
        )}  
        {postTicket.isSuccess && ( 
        <Dialog open={showDialog} >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ticket Details</DialogTitle>
              <DialogDescription>Ticket : {postTicket.data.queueLineLetter}{postTicket.data.queueLineNumber} </DialogDescription>
              <DialogDescription>Waiting Room : {postTicket.data.waitingRoomId} </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setShowDialog(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        )}
      </section>
    </div>
  );
}
