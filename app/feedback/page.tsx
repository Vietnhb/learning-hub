"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createFeedback } from "@/lib/feedbackService";
import { useMyFeedback } from "@/hooks/useMyFeedback";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { FeedbackCategory } from "@/types";

export default function FeedbackPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { feedback, loading: loadingFeedback, refetch } = useMyFeedback();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("general");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/auth/login?redirect=/feedback");
      return;
    }

    setSubmitting(true);
    setSuccess(false);

    const { success: submitSuccess, error } = await createFeedback({
      subject: subject.trim(),
      message: message.trim(),
      category,
    });

    if (submitSuccess) {
      setSuccess(true);
      setSubject("");
      setMessage("");
      setCategory("general");
      refetch();

      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert(error || "Failed to submit feedback");
    }

    setSubmitting(false);
  };

  if (!user) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Alert>
          <AlertDescription>
            Please{" "}
            <a href="/auth/login" className="underline">
              login
            </a>{" "}
            to submit feedback.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Feedback & Suggestions</h1>
        <p className="text-muted-foreground mt-2">
          We value your feedback! Let us know how we can improve.
        </p>
      </div>

      {/* Submit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Submit New Feedback
          </CardTitle>
          <CardDescription>
            Tell us about bugs, feature requests, or general improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {(
                  [
                    "bug",
                    "feature",
                    "improvement",
                    "general",
                    "other",
                  ] as FeedbackCategory[]
                ).map((cat) => (
                  <Button
                    key={cat}
                    type="button"
                    variant={category === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your feedback"
                required
                minLength={3}
                maxLength={200}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide detailed information about your feedback"
                required
                minLength={10}
                maxLength={5000}
                className="mt-2 min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {message.length}/5000 characters
              </p>
            </div>

            {success && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-400">
                  Thank you! Your feedback has been submitted successfully.
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* My Feedback History */}
      <Card>
        <CardHeader>
          <CardTitle>My Feedback History</CardTitle>
          <CardDescription>
            Track the status of your submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingFeedback ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : feedback.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No feedback submitted yet
            </p>
          ) : (
            <div className="space-y-4">
              {feedback.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{item.subject}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {item.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline">{item.category}</Badge>
                        <Badge
                          variant={
                            item.status === "pending"
                              ? "warning"
                              : item.status === "resolved"
                                ? "success"
                                : "info"
                          }
                        >
                          {item.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {item.admin_reply && (
                        <div className="mt-3 rounded bg-muted p-3">
                          <p className="text-xs font-medium mb-1">
                            Admin Reply:
                          </p>
                          <p className="text-sm">{item.admin_reply}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
