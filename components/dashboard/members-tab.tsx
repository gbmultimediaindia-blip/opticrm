"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { PlusCircle, Trash2, Mail, Shield, User } from "lucide-react";
import { addMember, getMembers, removeMember, updateMemberRole } from "@/actions/member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MembersTabProps {
    store: any;
    currentUser: any;
}

export function MembersTab({ store, currentUser }: MembersTabProps) {
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Add Member Form
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("viewer");

    const fetchMembers = async () => {
        try {
            const data = await getMembers(store.id);
            setMembers(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load members");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [store.id]);

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addMember(store.id, email, role);
            toast.success("Member added successfully");
            setAddDialogOpen(false);
            setEmail("");
            setRole("viewer");
            fetchMembers();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        try {
            await removeMember(memberId);
            toast.success("Member removed");
            setMembers(members.filter((m) => m.id !== memberId));
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const handleRoleChange = async (memberId: string, newRole: string) => {
        try {
            // Optimistic update
            setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
            await updateMemberRole(memberId, newRole);
            toast.success("Role updated");
        } catch (error: any) {
            fetchMembers(); // Revert on error
            toast.error(error.message);
        }
    };

    const isOwner = store.ownerId === currentUser.id;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Members</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage who has access to this store.
                    </p>
                </div>
                {isOwner && (
                    <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Member</DialogTitle>
                                <DialogDescription>
                                    Invite a user to manage this store. They must already have an account.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddMember} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="email"
                                            placeholder="colleague@example.com"
                                            className="pl-9"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={role} onValueChange={setRole}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin (Can edit store & members)</SelectItem>
                                            <SelectItem value="editor">Editor (Can manage inventory/bills)</SelectItem>
                                            <SelectItem value="viewer">Viewer (Read only)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white hover:bg-indigo-700">
                                        {isSubmitting ? "Adding..." : "Add Member"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-800" />

            <div className="grid gap-4">
                {/* Owner Card */}
                {isOwner && (
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-800">
                                    <AvatarImage src={currentUser.image} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{currentUser.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm text-slate-900 dark:text-white flex items-center gap-2">
                                        You
                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 font-bold uppercase tracking-wider">Owner</span>
                                    </p>
                                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {members.map((member) => (
                    <Card key={member.id} className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10 border border-slate-200 dark:border-slate-800">
                                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">{member.user.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm text-slate-900 dark:text-white">{member.user.name}</p>
                                    <p className="text-xs text-slate-500">{member.user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {isOwner ? (
                                    <Select
                                        defaultValue={member.role}
                                        onValueChange={(val) => handleRoleChange(member.id, val)}
                                    >
                                        <SelectTrigger className="w-[110px] h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="editor">Editor</SelectItem>
                                            <SelectItem value="viewer">Viewer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <span className="text-xs font-medium text-slate-500 capitalize px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                                        {member.role}
                                    </span>
                                )}

                                {isOwner && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Remove member?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to remove <strong>{member.user.name}</strong> from this store? They will lose all access immediately.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleRemoveMember(member.id)} className="bg-red-600 hover:bg-red-700 text-white">
                                                    Yes, remove
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}

                {members.length === 0 && !loading && (
                    <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                        <UsersIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No other members yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function UsersIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
