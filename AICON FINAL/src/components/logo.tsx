import { Brain } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  iconSize?: number;
  textSize?: string;
};

const Logo = ({ className, iconSize = 20, textSize = "text-xl" }: LogoProps) => {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <div className="bg-primary rounded-lg p-2 flex items-center justify-center">
        <Brain className="text-primary-foreground" size={iconSize} />
      </div>
      <span className={cn(textSize, "font-bold text-foreground")}>AICON</span>
    </Link>
  );
};

export default Logo;
