import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Person Re-Identification System</h1>
        <p className="text-xl text-gray-600">
          A comprehensive tool for person re-identification using videos and images
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/gallery"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Video Gallery</h2>
          <p className="text-gray-600">
            Upload and manage your video collection for person re-identification
          </p>
        </Link>

        <Link
          href="/targets"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Target Management</h2>
          <p className="text-gray-600">
            Add and manage target descriptions and reference images
          </p>
        </Link>

        <Link
          href="/cropper"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Target Cropper</h2>
          <p className="text-gray-600">
            Extract and crop target images from your video collection
          </p>
        </Link>

        <Link
          href="/prompt"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Prompt Builder</h2>
          <p className="text-gray-600">
            Create customized prompts for person re-identification analysis
          </p>
        </Link>

        <Link
          href="/results"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <p className="text-gray-600">
            View and analyze the results of person re-identification processing
          </p>
        </Link>
      </div>
    </div>
  );
}
