import { useGetBoard } from "@/features/board/api/use-get-board";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

type BreadcrumbLinkItem = {
  label: string;
  path: string;
};

export const useBreadcrumbs = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbLinkItem[]>([]);
  const [boardTitle, setBoardTitle] = useState("Loading...");
  const { boardId } = useParams() as { boardId: string };
  const board = useGetBoard({ boardId });

  useEffect(() => {
    const paths = location.pathname.split("/").filter(Boolean);
    const links: BreadcrumbLinkItem[] = [];

    paths.reduce((prev, curr) => {
      const path = `${prev}/${curr}`;
      let label: string = _.capitalize(curr.replace(/-/g, " "));

      if (curr.startsWith("board_")) {
        const boardId = curr.replace("board_", "");

        if (board.isPending) {
          setBoardTitle("Loading...");
        }

        if (board.error) {
          setBoardTitle(`Board [${boardId}]`);
        }

        if (board.data) {
          setBoardTitle(board.data.title);
        }

        label = boardTitle;
      }

      links.push({ label, path });

      return path;
    }, "");

    setBreadcrumbs(links);
  }, [location, boardTitle, board.isPending, board.error, board.data]);

  let displayedLinks: (BreadcrumbLinkItem | null)[] = [];
  const maxDisplayedLinks = 2;

  if (breadcrumbs.length > maxDisplayedLinks) {
    displayedLinks.push(breadcrumbs[0]);
    displayedLinks.push(null);
    displayedLinks.push(...breadcrumbs.slice(-1));
  } else {
    displayedLinks = [...breadcrumbs];
  }

  return { displayedLinks, maxDisplayedLinks, breadcrumbs };
};
