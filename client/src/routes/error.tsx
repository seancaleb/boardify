import { Button } from "@/components/ui/button";
import { toastMessageFormatter } from "@/utils/toast-message-formatter";
import { useDocumentTitle } from "@mantine/hooks";
import _ from "lodash";
import { Link, useRouteError } from "react-router-dom";
import Balancer from "react-wrap-balancer";

export const ErrorRoute = () => {
  const error = useRouteError();

  let errorTitle: string;
  let errorDescription: string;

  useDocumentTitle("Something went wrong - Kanban App");

  if (error instanceof Error) {
    const { title, description } = toastMessageFormatter(error.message);
    errorTitle = _.capitalize(title);
    errorDescription = description;
  } else {
    errorTitle = "Sorry, an unexpected error has occurred";
    errorDescription = "Something went wrong.";
  }

  return (
    <div className="absolute top-0 right-0 left-0 bottom-0 pt-[4.125rem] grid place-items-center">
      <div className="grid justify-items-center gap-1 text-center max-w-lg w-full">
        <Balancer>
          <div className="grid gap-4 justify-items-center">
            <div className="grid gap-1">
              <div className="text-3xl font-bold">🚨</div>
              <h3 className="text-2xl font-bold">{errorTitle}</h3>
              <div className="text-muted-foreground max-w-md">{errorDescription}</div>
            </div>

            <Button asChild>
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </Balancer>
      </div>
    </div>
  );
};
