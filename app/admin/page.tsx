"use client";

import React from "react";
import AdminHeader from "./components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  MessageSquare,
  MessageCircle,
  TrendingUp,
  User,
} from "lucide-react";
import { useUsers } from "@/hooks/useUsers";
import { useFeedback } from "@/hooks/useFeedback";
import { useConversations } from "@/hooks/useConversations";

export default function AdminDashboard() {
  const { users } = useUsers();
  const { feedback } = useFeedback();
  const { conversations } = useConversations();

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Total Feedback",
      value: feedback.length,
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Pending Feedback",
      value: feedback.filter((f) => f.status === "pending").length,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Active Conversations",
      value: conversations.filter((c) => c.status === "active").length,
      icon: MessageCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="flex flex-col">
      <AdminHeader
        title="Dashboard"
        description="Welcome to your admin dashboard"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedback.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        by {item.user?.full_name || item.user?.email}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                        item.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : item.status === "resolved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
                {feedback.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No feedback yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Conversations */}
          <Card>
            <CardHeader>
              <CardTitle>Active Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversations
                  .filter((c) => c.status === "active")
                  .slice(0, 5)
                  .map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {conv.user?.full_name || conv.user?.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(conv.last_message_at).toLocaleDateString()}
                        </p>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white flex-shrink-0">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  ))}
                {conversations.filter((c) => c.status === "active").length ===
                  0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    No active conversations
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
