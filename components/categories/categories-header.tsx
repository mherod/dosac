import { FileText } from "lucide-react";

export const CategoriesHeader = (): React.ReactElement => (
  <div className="bg-[#1d70b8] text-white py-6">
    <div className="container">
      <div className="flex items-center gap-3">
        <div className="rounded bg-white/10 p-1">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Ministerial Archive Categories</h1>
          <p className="text-sm text-white/80">
            Official categorisation of ministerial communications and incidents
          </p>
        </div>
      </div>
    </div>
  </div>
);
