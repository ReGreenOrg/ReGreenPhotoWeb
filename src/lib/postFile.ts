export interface PostFileResponse {
  code: 2000 | number;
  message: "OK" | string;
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
  };
}

export const postFile = async (files: File[]): Promise<PostFileResponse> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file);
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}api/couples/my/photos`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("파일 업로드 실패");
  }

  return res.json();
};
