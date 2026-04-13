import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
// It attempts to load CLOUDINARY_URL or independent explicitly defined ones
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        
        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert the File object into a node Buffer string
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // We wrap cloudinary upload in a promise because the uploader.upload_stream uses a callback
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "yachts" }, // Stores images safely inside a folder called "yachts"
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            
            // Push the buffer stream to Cloudinary
            uploadStream.end(buffer);
        });

        // The secure_url is the HTTPS globally accessible URL provided directly from Cloudinary
        return NextResponse.json({ 
            success: true, 
            url: (result as any).secure_url 
        }, { status: 200 });

    } catch (error: any) {
        console.error("Cloudinary Upload Error:", error);
        return NextResponse.json({ 
            error: error.message || "Failed to upload file to Cloudinary." 
        }, { status: 500 });
    }
}
