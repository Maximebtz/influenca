export const NextResponse = {
  json: (data: any, init?: ResponseInit) => {
    const response = new Response(JSON.stringify(data), init);
    Object.defineProperty(response, 'status', {
      get() {
        return init?.status || 200;
      }
    });
    return response;
  }
}; 