import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/mark_appointment')({
  component: () => MarkAppointmentPage(),
})

function MarkAppointmentPage() {
  return (
    <div>
      <h1>Mark Appointment</h1>
    </div>
  )
}