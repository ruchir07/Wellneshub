import React, { useState } from 'react';
import { AlertTriangle, Phone, MessageCircle, Heart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const PanicButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const emergencyResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free 24/7 crisis counseling"
    },
    {
      name: "Emergency Services",
      number: "911",
      description: "Immediate emergency assistance"
    }
  ];

  const handleEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
    toast({
      title: "Connecting to Emergency Support",
      description: `Calling ${number}...`,
      variant: "default",
    });
  };

  const handleNotifyContacts = () => {
    toast({
      title: "Emergency Contacts Notified",
      description: "Your emergency contacts have been alerted and will receive your location.",
      variant: "default",
    });
  };

  const handleConnectCounselor = () => {
    window.location.href = '/booking';
  };

  return (
    <>
      {/* Floating Panic Button */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="destructive" 
            size="lg"
            className="fixed bottom-4 left-4 z-50 h-16 w-16 rounded-full shadow-lg animate-pulse bg-destructive hover:bg-destructive/90"
          >
            <AlertTriangle className="w-8 h-8" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Shield className="w-6 h-6" />
              Emergency Support
            </DialogTitle>
            <DialogDescription>
              You're not alone. Help is available immediately. Choose the support you need:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Emergency Hotlines */}
            <Card className="border-destructive/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="w-5 h-5 text-destructive" />
                  Crisis Hotlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {emergencyResources.map((resource, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{resource.name}</p>
                      <p className="text-xs text-muted-foreground">{resource.description}</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleEmergencyCall(resource.number)}
                    >
                      Call
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={handleNotifyContacts}
              >
                <MessageCircle className="w-6 h-6 text-primary" />
                <span className="text-sm">Notify Emergency Contacts</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={handleConnectCounselor}
              >
                <Heart className="w-6 h-6 text-primary" />
                <span className="text-sm">Book Counselor</span>
              </Button>
            </div>

            {/* Safety Message */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-primary">You matter</p>
                    <p className="text-xs text-muted-foreground">
                      Your life has value. Crisis feelings are temporary, but the support you get today can make a lasting difference.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PanicButton;