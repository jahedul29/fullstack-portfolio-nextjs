"use client";

import { ReactNode, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaMailBulk,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { PiStackOverflowLogoFill } from "react-icons/pi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Section from "@/components/user/home/Section";
import { getErrorMessage } from "@/lib/get-error-message";
import { useCreateMessageMutation } from "@/redux/api/messageApi";
import { IOwner } from "@/types";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

type SocialLink = {
  href: string;
  label: string;
  icon: ReactNode;
};

const GetInTouch = ({
  ownerData,
  id = "",
}: {
  ownerData: IOwner;
  id?: string;
}) => {
  const [honeypot, setHoneypot] = useState("");
  const [createMessage, { isLoading }] = useCreateMessageMutation();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const onSubmit = async (values: ContactFormValues) => {
    if (honeypot) {
      return;
    }

    try {
      await createMessage(values).unwrap();
      toast.success("Message sent successfully. I will get back to you soon.");
      form.reset();
      setHoneypot("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const candidateSocialLinks: (SocialLink | undefined)[] = [
    ownerData?.githubUrl
      ? { href: ownerData.githubUrl, label: "GitHub", icon: <FaGithub /> }
      : undefined,
    ownerData?.linkedInUrl
      ? {
          href: ownerData.linkedInUrl,
          label: "LinkedIn",
          icon: <FaLinkedin />,
        }
      : undefined,
    ownerData?.facebookUrl
      ? { href: ownerData.facebookUrl, label: "Facebook", icon: <FaFacebook /> }
      : undefined,
    ownerData?.stackOverflowUrl
      ? {
          href: ownerData.stackOverflowUrl,
          label: "Stack Overflow",
          icon: <PiStackOverflowLogoFill />,
        }
      : undefined,
  ];
  const socialLinks = candidateSocialLinks.filter(
    (link): link is SocialLink => Boolean(link)
  );

  return (
    <Section
      id={id}
      eyebrow="Contact"
      title="Let's talk"
      subtitle="Open to interesting roles and freelance work — drop a message, it lands in my inbox."
      muted
    >
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <p className="text-muted-foreground">
            If you want to know more about anything, or just want to say hi,
            my inbox is always open. I will try my best to reply to every
            message.
          </p>

          <div className="space-y-2 text-sm">
            {ownerData?.address && (
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <FaMapMarkerAlt className="text-brand" />
                {ownerData.address}
              </p>
            )}
            {ownerData?.email && (
              <Link
                href={`https://mail.google.com/mail/u/0/?fs=1&to=${ownerData.email}&tf=cm`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Send an email"
                className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-brand"
              >
                <FaMailBulk className="text-brand" />
                {ownerData.email}
              </Link>
            )}
            {ownerData?.phoneNumber && (
              <p className="flex items-center gap-2 font-semibold text-foreground">
                <FaPhone className="text-brand" />
                {ownerData.phoneNumber}
              </p>
            )}
          </div>

          {ownerData?.calanderlyUrl && (
            <div className="text-sm">
              <p className="mb-1 text-muted-foreground">Schedule a meeting:</p>
              <Link
                href={ownerData.calanderlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Schedule a meeting via Calendly"
                className="font-semibold text-brand hover:underline"
              >
                {ownerData.calanderlyUrl}
              </Link>
            </div>
          )}

          {socialLinks.length > 0 && (
            <div>
              <p className="mb-3 text-sm text-muted-foreground">
                Social handles:
              </p>
              <div className="flex gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-border text-lg text-muted-foreground transition-colors hover:border-brand hover:text-brand"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <div
                aria-hidden="true"
                className="absolute left-[-9999px] h-px w-px overflow-hidden"
              >
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(event) => setHoneypot(event.target.value)}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        placeholder="What's up?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending…" : "Send message"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </Section>
  );
};

export default GetInTouch;
