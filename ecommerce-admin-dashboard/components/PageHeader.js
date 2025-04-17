import Link from "next/link";
import { Button } from "@/components/ui/button";

const PageHeader = ({ 
  title, 
  actionText, 
  actionHref, 
  actionOnClick, 
  isButton = false, 
  Icon,
  variant = "default",
  size = "default"
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      
      {isButton ? (
        <Button
          onClick={actionOnClick}
          variant={variant}
          size={size}
          className={Icon ? "gap-2" : ""}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {actionText}
        </Button>
      ) : (
        <Button asChild variant={variant} size={size}>
          <Link
            href={actionHref}
            className={Icon ? "gap-2" : ""}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {actionText}
          </Link>
        </Button>
      )}
    </div>
  );
};

export default PageHeader;