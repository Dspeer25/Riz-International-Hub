import FileUploader from '@/components/FileUploader';

export default function FilesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Files</h1>
        <p className="text-sm text-[#666666] mt-1">Upload and manage content assets</p>
      </div>
      <FileUploader />
    </div>
  );
}
