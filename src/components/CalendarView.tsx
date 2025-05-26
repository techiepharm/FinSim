
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, PiggyBank, Target, DollarSign, Bell } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface FinancialEvent {
  id: string;
  date: string;
  title: string;
  type: 'income' | 'expense' | 'goal' | 'reminder';
  amount?: number;
  description: string;
}

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const demoEvents: FinancialEvent[] = [
    {
      id: '1',
      date: '2024-01-15',
      title: 'Salary Payment',
      type: 'income',
      amount: 3500,
      description: 'Monthly salary deposit'
    },
    {
      id: '2',
      date: '2024-01-20',
      title: 'Rent Payment',
      type: 'expense',
      amount: 1200,
      description: 'Monthly rent payment due'
    },
    {
      id: '3',
      date: '2024-01-25',
      title: 'Emergency Fund Goal',
      type: 'goal',
      amount: 500,
      description: 'Save $500 towards emergency fund'
    },
    {
      id: '4',
      date: '2024-01-30',
      title: 'Investment Review',
      type: 'reminder',
      description: 'Review portfolio performance and rebalance if needed'
    },
    {
      id: '5',
      date: '2024-02-01',
      title: 'Budget Review',
      type: 'reminder',
      description: 'Review last month expenses and plan for February'
    },
    {
      id: '6',
      date: '2024-02-10',
      title: 'Insurance Premium',
      type: 'expense',
      amount: 250,
      description: 'Quarterly insurance payment'
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'income': return <DollarSign className="h-4 w-4 text-green-400" />;
      case 'expense': return <TrendingUp className="h-4 w-4 text-red-400" />;
      case 'goal': return <Target className="h-4 w-4 text-blue-400" />;
      case 'reminder': return <Bell className="h-4 w-4 text-yellow-400" />;
      default: return <Calendar className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'income': return 'border-l-green-500 bg-green-900/20';
      case 'expense': return 'border-l-red-500 bg-red-900/20';
      case 'goal': return 'border-l-blue-500 bg-blue-900/20';
      case 'reminder': return 'border-l-yellow-500 bg-yellow-900/20';
      default: return 'border-l-gray-500 bg-gray-900/20';
    }
  };

  const getCurrentMonthEvents = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return demoEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return demoEvents
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const handleAddEvent = () => {
    toast("📅 Add Event", {
      description: "Feature coming soon! This is a demo calendar view.",
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 3000,
    });
  };

  const handleEventClick = (event: FinancialEvent) => {
    toast(`📋 ${event.title}`, {
      description: event.description + (event.amount ? ` - $${event.amount}` : ''),
      className: "bg-slate-600 border-slate-700 text-white",
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Financial Calendar</h1>
            <p className="text-slate-400">📅 Demo Account - Track your financial events and deadlines</p>
          </div>
          <Button onClick={handleAddEvent} className="bg-green-600 hover:bg-green-700">
            <Calendar className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  January 2024
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-slate-400 font-medium py-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => {
                    const day = i + 1;
                    const hasEvent = demoEvents.some(event => 
                      new Date(event.date).getDate() === day && 
                      new Date(event.date).getMonth() === 0
                    );
                    
                    return (
                      <div
                        key={day}
                        className={`
                          p-2 text-center cursor-pointer rounded transition-colors
                          ${hasEvent 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'text-slate-300 hover:bg-slate-700'
                          }
                        `}
                        onClick={() => {
                          if (hasEvent) {
                            const dayEvents = demoEvents.filter(event => 
                              new Date(event.date).getDate() === day
                            );
                            if (dayEvents.length > 0) {
                              handleEventClick(dayEvents[0]);
                            }
                          }
                        }}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Events */}
          <div>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {getUpcomingEvents().map(event => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors hover:bg-slate-700 ${getEventColor(event.type)}`}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2">
                        {getEventIcon(event.type)}
                        <div>
                          <h4 className="font-medium text-white text-sm">{event.title}</h4>
                          <p className="text-xs text-slate-400">{event.description}</p>
                          {event.amount && (
                            <p className="text-xs font-medium text-green-400">
                              ${event.amount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <Card className="bg-slate-800 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white">This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected Income:</span>
                  <span className="text-green-400">$3,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Planned Expenses:</span>
                  <span className="text-red-400">$1,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Savings Goals:</span>
                  <span className="text-blue-400">$500</span>
                </div>
                <hr className="border-slate-700" />
                <div className="flex justify-between font-medium">
                  <span className="text-white">Net Amount:</span>
                  <span className="text-green-400">+$1,550</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Types Legend */}
        <Card className="bg-slate-800 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="text-slate-300">Income</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-red-400" />
                <span className="text-slate-300">Expenses</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-400" />
                <span className="text-slate-300">Goals</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4 text-yellow-400" />
                <span className="text-slate-300">Reminders</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
