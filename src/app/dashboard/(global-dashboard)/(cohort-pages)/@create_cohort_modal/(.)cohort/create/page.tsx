export const dynamic = "force-dynamic";

import { getUserProfile } from "@/queries/cached-queries";
import CreateCohortModal from "./create-cohort-modal";

export default async function Page() {
	const user = await getUserProfile();

	return <CreateCohortModal userEmail={user.email} />;
}
