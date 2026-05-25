export type ActionResult<T = void> =
  | ({ success: true } & (T extends void ? object : { data: T }))
  | { success: false; error: string };

export function actionError(error: string): { success: false; error: string } {
  return { success: false, error };
}

export function actionOk<T = void>(
  data?: T extends void ? never : T
): ActionResult<T> {
  if (data === undefined) {
    return { success: true } as ActionResult<T>;
  }
  return { success: true, data } as ActionResult<T>;
}
