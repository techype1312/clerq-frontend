import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const routePermissionMatcher = (
  permission: boolean,
  router: AppRouterInstance,
  redirectTo?: string,
) => {
  if(permission) return true;
  else if (redirectTo) {
    router.push(redirectTo);
  }
  else {
    return false;
  }
};