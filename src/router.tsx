import { createRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import NotFound from "@/components/custom/errors/not-found";
import { parseSearch, stringifySearch } from "@/lib/router-search";
import { createAppQueryClient } from "@/lib/tanstack-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
  const queryClient = createAppQueryClient();
  const router = createRouter({
    routeTree,
    parseSearch,
    stringifySearch,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: NotFound,
    context: {
      queryClient,
    },
  });

  return routerWithQueryClient(router, queryClient);
};
