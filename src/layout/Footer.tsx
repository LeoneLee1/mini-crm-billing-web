export default function Footer() {
  return (
    <footer className="px-6 py-4 border-t border-gray-100 bg-white shrink-0">
      <p className="text-xs text-gray-400 text-center">
        &copy; {new Date().getFullYear()} Lee Digital &mdash; Created by{" "}
        <span className="font-medium text-gray-500">Daniel Lee</span>
      </p>
    </footer>
  );
}
