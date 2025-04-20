// export async function getAssets(cursor = '', search = '') {
//     const res = await fetch(
//       `https://8080-majeduldev-fullstackeco-emaatv5g85b.ws-us118.gitpod.io/api/assets?cursor=${cursor}&search=${search}`
//     );
//     const { data } = await res.json();
//     return data;
//   }

  export async function getAssets(cursor = '', search = '') {
    const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assets?cursor=${cursor}&search=${search}`);
    url.searchParams.set('cursor', cursor);
    if (search) url.searchParams.set('search', search);
  
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Failed to fetch assets');
    
    const { data } = await res.json();
    return data;
  }
  
  export async function deleteAssets(public_ids) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assets`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_ids })
    });
    return await res.json();
  }
  
  export async function uploadAsset(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      { method: 'POST', body: formData }
    );
    return await res.json();
  }