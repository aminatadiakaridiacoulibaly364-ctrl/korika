/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Autorise aussi le domaine Supabase Storage si vous hébergez les photos là-bas :
      { protocol: 'https', hostname: '**.supabase.co' }
    ]
  }
};
export default nextConfig;
