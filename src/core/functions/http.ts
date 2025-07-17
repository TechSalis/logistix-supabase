export function badRequest(message?: string) {
  return jsonResponseMessage(message || "Bad Request", 400);
}

export function unauthorized(message?: string) {
  return jsonResponseMessage(message || "Unauthorized", 401);
}

export function forbidden(message?: string) {
  return jsonResponseMessage(message || "Forbidden", 403);
}

export function notFound(message?: string) {
  return jsonResponseMessage(message || "Not Found", 404);
}

export function internalServerError(message?: string) {
  return jsonResponseMessage(message || "Internal Server Error", 500);
}

export function success(message?: string) {
  return jsonResponseMessage(message || "Success", 200);
}

export function jsonResponseMessage(message: string, status: number) {
  return Response.json(
    typeof message === "string" ? { message: message } : message,
    { status: status },
  );
}
