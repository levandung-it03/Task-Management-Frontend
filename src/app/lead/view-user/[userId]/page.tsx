import UserProfile from "@/app-reused/view-user/page"

export default async function LeadUserProfilePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  return <UserProfile userId={parseInt(userId)} />
}

