
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Upload, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase/provider";

const HeroSection = () => {
  const { toast } = useToast();
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-background");
  const { user } = useUser();
  const router = useRouter();

  const handleWatchDemo = () => {
    toast({
      title: "Coming Soon!",
      description: "The demo video will be available shortly.",
    });
  };
  
  const handleStartTrialClick = () => {
     router.push(user ? '/upload' : '/login');
  }

  return (
    <>
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden py-20 md:py-32">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover opacity-20"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight font-headline">
              Intelligent Conference Management{" "}
              <span className="text-primary">Powered by AI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Streamline your academic conference workflow with our AI-powered
              platform. Detect plagiarism, check grammar, suggest reviewers, and
              manage submissions with unprecedented efficiency and accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="px-8 py-6 text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                onClick={handleStartTrialClick}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
                onClick={handleWatchDemo}
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
