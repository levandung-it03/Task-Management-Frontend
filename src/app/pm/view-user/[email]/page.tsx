import UserProfile from "@/app-reused/view-user/page"

export default async function PmUserProfilePage({ params }: { params: Promise<{ email: string }> }) {
  const { email } = await params
  return <UserProfile email={email} />
}

