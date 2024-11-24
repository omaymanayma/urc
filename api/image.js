import { put } from '@vercel/blob';

export async function POST(request) {
    console.log(request.url)
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
console.log("ha lfilname", filename)
  try {
    const blob = await put(filename, request.body, { access: 'public' });

    console.log('------------------------------------');
    console.log(blob);  
    console.log('------------------------------------');

    // Return the blob as JSON response
    return new Response(JSON.stringify(blob), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error uploading file:', error);  
    return new Response(
      JSON.stringify({ error: 'Failed to upload file' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};