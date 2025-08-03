import React from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem
} from "@/components/ui/sidebar";
import { ChartCandlestick, Home, User } from "lucide-react";
import Link from "next/link";
import { DateTimePicker } from "@/components/layout/date-time-picker";

export default function SideBar() {
    const navItems = [
        {
            name: "Home",
            icon: Home,
            url: "/"
        },
        {
            name: "Stocks",
            icon: ChartCandlestick,
            url: "/stocks"
        },
        {
            name: "Portfolio",
            icon: User,
            url: "/portfolio"
        }
    ]

    return (
        <Sidebar>
            <SidebarContent>
                <div className="flex flex-col h-full justify-between mb-5">
                <SidebarGroup>
                    <SidebarGroupLabel>Welcome back</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((project, i) => (
                                <SidebarMenuItem key={i}>
                                    <SidebarMenuButton asChild>
                                        <Link href={project.url}>
                                            <project.icon/>
                                            <span>{project.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <DateTimePicker />
                </div>
            </SidebarContent>
        </Sidebar>
    );
}