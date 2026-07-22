"use client";

import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";

const GotoTopButton = () => {
  return (
    <Button
      size="icon"
      variant="outline"
      className="fixed bottom-6 right-6 z-40 rounded-full border-border bg-card text-foreground shadow-md hover:border-brand hover:text-brand md:bottom-12 md:right-12"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Go to top"
      title="Go to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};

export default GotoTopButton;
