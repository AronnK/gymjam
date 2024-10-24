import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-slate-500 p-3 z-50">
      <div className="flex justify-between">
        <Button>Settings</Button>
      </div>
    </div>
  );
}
