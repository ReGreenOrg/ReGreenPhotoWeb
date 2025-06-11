import ResultPage from "@/views/ResultPage";

export default async function Page({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;

  return <ResultPage type={type} />;
}
