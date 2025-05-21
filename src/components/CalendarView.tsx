
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, addDays } from "date-fns";
import { CalendarDays, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Event = {
  id: string;
  title: string;
  date: Date;
  type: 'learning' | 'trading' | 'goal';
  description?: string;
};

const CalendarView = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Complete Stock Market Basics',
      date: new Date(),
      type: 'learning',
      description: 'Finish the introductory course on stock markets'
    },
    {
      id: '2',
      title: 'Portfolio Review',
      date: addDays(new Date(), 2),
      type: 'trading',
      description: 'Quarterly review of portfolio performance'
    },
    {
      id: '3',
      title: 'Monthly Profit Goal Deadline',
      date: addDays(new Date(), 10),
      type: 'goal',
      description: 'Reach $5,000 monthly profit target'
    }
  ]);

  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    date: new Date(),
    type: 'learning',
    description: ''
  });

  const todayEvents = events.filter(
    event => format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  const handleAddEvent = () => {
    if (!newEvent.title) {
      toast.error("Please enter an event title");
      return;
    }

    const event: Event = {
      ...newEvent,
      id: Date.now().toString()
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: '',
      date: new Date(),
      type: 'learning',
      description: ''
    });

    toast.success("Event added successfully");
  };

  const getEventTypeStyles = (type: string) => {
    switch (type) {
      case 'learning':
        return "bg-blue-100 text-blue-800";
      case 'trading':
        return "bg-green-100 text-green-800";
      case 'goal':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-finance-primary">Financial Calendar</h2>
          <p className="text-muted-foreground">Schedule your financial activities and set reminders</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-finance-primary">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>
                Create a new event for your financial calendar
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div>
                <label className="text-sm font-medium" htmlFor="event-title">Event Title</label>
                <Input
                  id="event-title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Event Type</label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value: 'learning' | 'trading' | 'goal') => 
                    setNewEvent({ ...newEvent, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="trading">Trading</SelectItem>
                    <SelectItem value="goal">Goal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Date</label>
                <Calendar
                  mode="single"
                  selected={newEvent.date}
                  onSelect={(date) => date && setNewEvent({ ...newEvent, date })}
                  className="rounded-md border"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium" htmlFor="event-desc">Description</label>
                <Input
                  id="event-desc"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Add details (optional)"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="submit" onClick={handleAddEvent}>Add Event</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
              disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 30))}
              modifiers={{
                booked: events.map(event => new Date(event.date))
              }}
              modifiersStyles={{
                booked: { fontWeight: "bold", textDecoration: "underline" }
              }}
            />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Events for {format(date, "MMMM d, yyyy")}</CardTitle>
            <CardDescription>
              {todayEvents.length 
                ? `You have ${todayEvents.length} event${todayEvents.length > 1 ? 's' : ''} scheduled` 
                : 'No events scheduled for this day'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todayEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarDays className="mx-auto h-12 w-12 opacity-30 mb-2" />
                <p>No financial activities scheduled for today</p>
                <p className="text-sm mt-1">Click "Add Event" to schedule something</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayEvents.map(event => (
                  <div key={event.id} className="rounded-lg border p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        {event.description && (
                          <p className="text-muted-foreground text-sm mt-1">{event.description}</p>
                        )}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs capitalize ${getEventTypeStyles(event.type)}`}>
                        {event.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {events
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .filter(event => event.date >= new Date(new Date().setHours(0, 0, 0, 0)))
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="py-3 flex justify-between items-start">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-sm">{format(new Date(event.date), "MMM d, yyyy")}</div>
                    <div className={`px-2 py-1 rounded-full text-xs capitalize ${getEventTypeStyles(event.type)}`}>
                      {event.type}
                    </div>
                  </div>
                </div>
              ))}
              
            {events.filter(event => event.date >= new Date()).length === 0 && (
              <div className="py-6 text-center text-muted-foreground">
                No upcoming events scheduled
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
