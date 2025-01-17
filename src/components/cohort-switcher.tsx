"use client";

import { format } from "date-fns";
import {
	AlignJustifyIcon,
	ChevronRight,
	ChevronsUpDown,
	GraduationCap,
	Users,
} from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import type { getUserCohortsQuery } from "@/queries";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Cohort = Awaited<ReturnType<Awaited<typeof getUserCohortsQuery>>>[number];

export default function CohortSwitcher({
	cohorts = [],
	activeCohortId,
}: { cohorts: Cohort[]; activeCohortId: number }) {
	const { isMobile } = useSidebar();
	const router = useRouter();
	const pathname = usePathname();
	const [activeCohort, setActiveCohort] = React.useState<Cohort | null>(
		cohorts?.find((cohort) => cohort.cohort_id === activeCohortId) ||
			(cohorts?.length > 0 ? cohorts[0] : null),
	);

	if (!cohorts?.length) {
		return null;
	}

	const formatSemester = (semester: string) => {
		return semester.charAt(0).toUpperCase() + semester.slice(1);
	};

	const handleCohortChange = (cohort: Cohort) => {
		setActiveCohort(cohort);
		const newPath = pathname.replace(
			/\/cohort\/\d+/,
			`/cohort/${cohort.cohort_id}`,
		);
		router.replace(newPath);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<Avatar className="size-8 rounded-lg">
						{activeCohort?.avatar_url ? (
							<AvatarImage
								src={activeCohort.avatar_url}
								alt={`${activeCohort.semester} ${activeCohort.year}`}
							/>
						) : (
							<AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								{formatSemester(activeCohort?.semester || "").charAt(0)}
								{activeCohort?.year.toString().slice(-2)}
							</AvatarFallback>
						)}
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">
							{formatSemester(activeCohort?.semester || "")}{" "}
							{activeCohort?.year}
						</span>
						<span className="truncate text-xs">
							{format(new Date(activeCohort?.start_date || ""), "MMM d")} -{" "}
							{format(new Date(activeCohort?.end_date || ""), "MMM d")}
						</span>
					</div>
					<ChevronsUpDown className="ml-auto size-4" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				align="start"
				side={isMobile ? "bottom" : "right"}
				sideOffset={8}
			>
				<DropdownMenuLabel className="text-xs text-muted-foreground">
					Active Cohorts
				</DropdownMenuLabel>
				{cohorts.map((cohort) => (
					<DropdownMenuItem
						key={cohort.cohort_id}
						onClick={() => handleCohortChange(cohort)}
						className="gap-2 p-2"
					>
						<Avatar className="size-6 rounded-sm border">
							{cohort.avatar_url ? (
								<AvatarImage
									src={cohort.avatar_url}
									alt={`${cohort.semester} ${cohort.year}`}
								/>
							) : (
								<AvatarFallback className="bg-primary/10 rounded-sm">
									{formatSemester(cohort.semester).charAt(0)}
									{cohort.year.toString().slice(-2)}
								</AvatarFallback>
							)}
						</Avatar>
						<div className="flex-1">
							<p className="text-sm font-medium leading-none">
								{formatSemester(cohort.semester)} {cohort.year}
							</p>
							<p className="text-xs text-muted-foreground">
								{format(new Date(cohort.start_date), "MMM d")} -{" "}
								{format(new Date(cohort.end_date), "MMM d")}
							</p>
						</div>
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<Users className="size-3" />
								<span>{cohort.mentee_count}</span>
							</div>
							<ChevronRight className="size-3 opacity-50" />
							<div className="flex items-center gap-1">
								<GraduationCap className="size-3" />
								<span>{cohort.mentor_count}</span>
							</div>
						</div>
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />

				<DropdownMenuItem>
					<Link href="/dashboard/cohorts" className="flex items-center">
						<AlignJustifyIcon className="mr-2" />
						<span className="font-medium text-muted-foreground">
							Manage Your Cohorts
						</span>
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
