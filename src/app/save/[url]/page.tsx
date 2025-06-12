import SavePage from "@/views/SavePage";

export default async function Page({ params }: { params: Promise<{ url: string }> }) {
  const { url } = await params;

  return <SavePage url={url} />;
}
