import HomePage from "@/views/HomePage";

export default async function Page({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;

  return <HomePage type={type} />;
}
