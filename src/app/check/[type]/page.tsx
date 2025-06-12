import CheckPage from "@/views/CheckPage";

export default async function Page({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;

  return <CheckPage type={type} />;
}
