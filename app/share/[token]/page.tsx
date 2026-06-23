import { notFound } from "next/navigation";
import { getSharedClientData } from "@/app/actions/share";
import { SharedClientView } from "@/components/share/SharedClientView";

export const dynamic = "force-dynamic";

interface SharePageProps {
  params: Promise<{ token: string }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  const data = await getSharedClientData(token);
  if (!data) notFound();
  return <SharedClientView data={data} />;
}
