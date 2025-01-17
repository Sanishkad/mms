import type * as React from "react";

// import { TeamSwitcher } from "@/components/nav-cohort";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarRail,
} from "@/components/ui/sidebar";
import {
	getUserCohortRole,
	getUserCohorts,
	getUserProfile,
} from "@/queries/cached-queries";
import CohortSwitcher from "./cohort-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { ThemeSwitcher } from "./theme-switcher";

export async function CohortDashboardSidebar({
	cohortId,
	children,
	...props
}: { cohortId: number } & React.ComponentProps<typeof Sidebar>) {
	const cohorts = await getUserCohorts();
	const user = await getUserProfile();
	const { cohortRole } = await getUserCohortRole(cohortId);

	const userWithCohortRole = {
		...user,
		cohort_role: cohortRole,
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<CohortSwitcher cohorts={cohorts} activeCohortId={cohortId} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain cohortId={cohortId} />
				{/* <NavProjects projects={data.projects} /> */}
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu className="hidden group-data-[collapsible=icon]:flex">
					<ThemeSwitcher className="border-2" />
				</SidebarMenu>

				<NavUser user={userWithCohortRole} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
