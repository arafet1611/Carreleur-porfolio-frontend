export default function AdminFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Copyright */}
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
          </div>

          

          {/* Right side - Version info */}
          <div className="text-gray-500 text-sm">
           <span className="hidden sm:inline" >Version 1.0.0</span>
          </div>
        </div>
      </div>
                  <div className="pb-12 md:pb-0"> </div>

    </footer>
  );
}