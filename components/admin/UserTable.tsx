"use client";

import React, { useState } from "react";
import { UserWithRole } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Shield, User, Trash2, Ban, Pencil } from "lucide-react";
import {
  updateUserRole,
  deleteUser,
  adminUpdateUserProfile,
  setUserBanStatus,
} from "@/lib/adminService";

interface UserTableProps {
  users: UserWithRole[];
  onlineUserIds?: Set<string>;
  onUpdate: () => void;
}

export default function UserTable({
  users,
  onlineUserIds,
  onUpdate,
}: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editDateOfBirth, setEditDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (userId: string, newRoleId: number) => {
    setLoading(true);
    const { success, error } = await updateUserRole(userId, newRoleId);

    if (success) {
      onUpdate();
    } else {
      alert(error || "Failed to update role");
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setLoading(true);
    const { success, error } = await deleteUser(selectedUser.id);

    if (success) {
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      onUpdate();
    } else {
      alert(error || "Failed to delete user");
    }
    setLoading(false);
  };

  const openEditDialog = (user: UserWithRole) => {
    setSelectedUser(user);
    setEditFullName(user.full_name || "");
    setEditDateOfBirth(user.date_of_birth || "");
    setEditDialogOpen(true);
  };

  const handleUpdateProfile = async () => {
    if (!selectedUser) return;

    setLoading(true);
    const { success, error } = await adminUpdateUserProfile(
      selectedUser.id,
      editFullName.trim(),
      editDateOfBirth || null,
    );

    if (success) {
      setEditDialogOpen(false);
      setSelectedUser(null);
      onUpdate();
    } else {
      alert(error || "Failed to update user profile");
    }
    setLoading(false);
  };

  const handleBanToggle = async (user: UserWithRole) => {
    setLoading(true);
    const { success, error } = await setUserBanStatus(user.id, !user.is_banned);

    if (success) {
      onUpdate();
    } else {
      alert(error || "Failed to update user ban status");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Online</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">No users found</p>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
                const isOnline = onlineUserIds?.has(user.id.toLowerCase()) ?? false;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>{user.full_name || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role_name === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role_name === "admin" && (
                          <Shield className="mr-1 h-3 w-3" />
                        )}
                        {user.role_name === "user" && (
                          <User className="mr-1 h-3 w-3" />
                        )}
                        {user.role_name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={isOnline ? "default" : "secondary"}>
                        {isOnline ? "Online" : "Offline"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.is_banned ? "destructive" : "secondary"}
                      >
                        {user.is_banned ? "Banned" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.date_of_birth
                        ? new Date(user.date_of_birth).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(user.id, 1)}
                            disabled={user.role_id === 1 || loading}
                          >
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRoleChange(user.id, 2)}
                            disabled={user.role_id === 2 || loading}
                          >
                            Make User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openEditDialog(user)}
                            disabled={loading}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleBanToggle(user)}
                            className={
                              user.is_banned ? "text-green-600" : "text-amber-600"
                            }
                            disabled={loading}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            {user.is_banned ? "Unban User" : "Ban User"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                            disabled={loading}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{selectedUser?.email}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update profile information for <strong>{selectedUser?.email}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="admin-edit-full-name">Full Name</Label>
              <Input
                id="admin-edit-full-name"
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                placeholder="Nguyen Van A"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-edit-dob">Date of Birth</Label>
              <Input
                id="admin-edit-dob"
                type="date"
                value={editDateOfBirth}
                onChange={(e) => setEditDateOfBirth(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
