import { createFileRoute } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


export const Route = createFileRoute('/mark_appointment')({
  component: () => MarkAppointmentPage(),
})

function MarkAppointmentPage() {

  return (
    <main className="flex flex-col items-center w-full min-h-screen bg-gradient-to-b from-background to-blue-300">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Mark Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs>
            <TabsList>
              <TabsTrigger value="speciality">Speciality</TabsTrigger>
            </TabsList>
            <TabsContent value="speciality">
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button>du</Button>
        </CardFooter>
      </Card>
    </main>
  )

}