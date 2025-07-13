export function badRequest(message?: string) {
  return new Response(message || 'Bad Request', { status: 400 });
}

export function unauthorized(message?: string) {
  return new Response(message || 'Unauthorized', { status: 401 });
}

export function forbidden(message?: string) {
  return new Response(message || 'Forbidden', { status: 403 });
}

export function notFound(message?: string) {
  return new Response(message || 'Not Found', { status: 404 });
}

export function internalServerError(message?: string) {
  return new Response(message || 'Internal Server Error', { status: 500 });
}

export function success(message?: string) {
  return new Response(message || 'Success', { status: 200 });
}