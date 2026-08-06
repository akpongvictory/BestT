interface Props {
  onClick: () => void;
}

export default function UploadButton({
  onClick,
}: Props) {
  return (
    <div className="mt-8">
      <button
        onClick={onClick}
        className="rounded-lg bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
      >
        Upload Document
      </button>
    </div>
  );
}