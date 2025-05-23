
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface OnboardingTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingTutorial = ({ isOpen, onClose }: OnboardingTutorialProps) => {
  const [step, setStep] = useState(0);
  
  const steps = [
    {
      title: "Welcome to FinSavvy!",
      description: "Your journey to financial literacy and smart investing starts here. Let's take a quick tour of the app.",
      image: "/placeholder.svg"
    },
    {
      title: "Dashboard",
      description: "This is your home base. View your account balance, track your learning progress, and see your investment performance at a glance.",
      image: "/placeholder.svg"
    },
    {
      title: "Learning Center",
      description: "Complete interactive lessons on saving, budgeting, investing, and more. Watch videos, take quizzes, and earn achievements.",
      image: "/placeholder.svg"
    },
    {
      title: "Trading Simulator",
      description: "Practice buying and selling stocks with virtual money. Analyze market trends, research companies, and build your portfolio.",
      image: "/placeholder.svg"
    },
    {
      title: "Financial Assistant",
      description: "Have questions? Click the assistant button in the bottom right corner anytime to get help with financial concepts or app navigation.",
      image: "/placeholder.svg"
    },
    {
      title: "You're all set!",
      description: "Start by exploring the Learning Center or jump right into trading. Remember, you can always access this tutorial again from the Dashboard.",
      image: "/placeholder.svg"
    }
  ];
  
  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
      setStep(0);
    }
  };
  
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const currentStep = steps[step];
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-400">{currentStep.title}</DialogTitle>
          <DialogDescription className="text-slate-300">
            {step + 1} of {steps.length}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-slate-700 rounded-md h-48 mb-4 flex items-center justify-center">
            <img src={currentStep.image} alt="Tutorial" className="h-full w-full object-contain opacity-70" />
          </div>
          <p className="text-slate-300">{currentStep.description}</p>
        </div>
        
        <DialogFooter className="flex justify-between">
          <div>
            {step > 0 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>
          <Button className="bg-green-600 hover:bg-green-700" onClick={nextStep}>
            {step < steps.length - 1 ? "Next" : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Finish
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingTutorial;
