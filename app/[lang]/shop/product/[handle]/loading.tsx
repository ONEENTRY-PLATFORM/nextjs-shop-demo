export default function Loading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-gray-600 mr-3" />
      <span className="text-gray-600">Загрузка товара…</span>
    </div>
  );
}
