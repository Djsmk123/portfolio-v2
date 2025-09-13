"use client";

import { useState } from "react";
import { LargeTitle, SmallTitle } from "../components/section";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage({
  fromHome = false,
}: {
  fromHome?: boolean;
}) {
  const [booked, setBooked] = useState(false);

  const handleBookCall = () => {
    // Simulate booking process
    setBooked(true);
    setTimeout(() => {
      window.open("https://calendly.com/your-username", "_blank");
    }, 1000);
  };

  const content = (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <LargeTitle>Let&apos;s Work Together</LargeTitle>
          <SmallTitle>Ready to bring your ideas to life? Let&apos;s discuss your project.</SmallTitle>
        </div>

        {booked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-8 p-6 rounded-lg border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
          >
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              Call Scheduled!
            </h3>
            <p className="text-green-700 dark:text-green-300 text-sm">
              You&apos;ll be redirected to Calendly to confirm your meeting time.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Call Benefits */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center p-4 rounded-lg border bg-background/50 backdrop-blur-sm">
                <Clock className="h-8 w-8 text-blue-500 mb-2" />
                <h3 className="font-semibold text-sm">30 Min Call</h3>
                <p className="text-xs text-muted-foreground text-center">Quick project discussion</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg border bg-background/50 backdrop-blur-sm">
                <Phone className="h-8 w-8 text-green-500 mb-2" />
                <h3 className="font-semibold text-sm">Free Consultation</h3>
                <p className="text-xs text-muted-foreground text-center">No cost, just advice</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg border bg-background/50 backdrop-blur-sm">
                <Calendar className="h-8 w-8 text-purple-500 mb-2" />
                <h3 className="font-semibold text-sm">Flexible Timing</h3>
                <p className="text-xs text-muted-foreground text-center">Pick your preferred time</p>
              </div>
            </div>

            {/* Book Call Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex justify-center"
            >
              <Button
                onClick={handleBookCall}
                size="lg"
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book a Free Call
              </Button>
            </motion.div>

            {/* Additional Info */}
            <div className="text-sm text-muted-foreground text-center">
              <p>Available Monday - Friday, 9 AM - 5 PM IST</p>
              <p className="mt-1">We&apos;ll discuss your project requirements and next steps.</p>
            </div>
          </motion.div>
        )}
      </motion.div>
 
  );

  if (fromHome) return content;

  return <main className="min-h-dvh px-4 py-10 md:px-8">{
    <div className="flex flex-col items-center justify-center min-h-[70vh] max-w-2xl mx-auto text-center">
      {content}
    </div>
  }</main>;
}

