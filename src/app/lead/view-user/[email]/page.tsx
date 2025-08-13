import UserProfile from "@/app-reused/view-user/page"

export default async function LeadUserProfilePage({ params }: { params: Promise<{ email: string }> }) {
  const { email } = await params
  return <UserProfile email={email} />
}

