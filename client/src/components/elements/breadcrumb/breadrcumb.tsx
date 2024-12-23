import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  Breadcrumb as BreadcrumbMain,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { useBreadcrumbs } from "./use-breadcrumbs";

export const Breadcrumb = () => {
  const { breadcrumbs, maxDisplayedLinks, displayedLinks } = useBreadcrumbs();
  const location = useLocation();

  return (
    <BreadcrumbMain>
      <BreadcrumbList className="text-sm">
        {displayedLinks.map((link, index) => (
          <Fragment key={`breadcrumb-${link}-${index}`}>
            {link ? (
              location.pathname === link.path ? (
                <BreadcrumbItem>
                  <BreadcrumbPage>{link.label}</BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      asChild
                      className={cn(
                        location.pathname.includes("settings") && "pointer-events-none"
                      )}
                    >
                      <Link to={link.path}>{link.label}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )
            ) : (
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="icon" />
                    <BreadcrumbSeparator />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {breadcrumbs
                      .slice(1, location.pathname.split("/").length - maxDisplayedLinks)
                      .map((link, index) => (
                        <DropdownMenuItem key={`breadcrumb-dropdown-${link}-${index}`} asChild>
                          <Link to={link.path}>{link.label}</Link>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
            )}
          </Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbMain>
  );
};
