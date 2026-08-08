export const uploadImageToImgBB = async (imageFile) => {
  if (!imageFile) return null;

  const formData = new FormData();
  formData.append("image", imageFile);

  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    console.error("ImgBB API key is missing in .env.local");
    return null;
  }

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "Image upload failed");
    }
  } catch (error) {
    console.error("ImgBB Upload Error:", error);
    return null;
  }
};