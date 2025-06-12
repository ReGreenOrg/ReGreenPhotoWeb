import SavePage from "@/views/SavePage";

export default async function Page({ params }: { params: Promise<{ url: string }> }) {
  const { url } = await params;
  const decodedUrl = decodeURIComponent(url);

  return <SavePage url={decodedUrl} />;
}
