const domain = process.env.NODE_ENV === "development" ? "http://0.0.0.0:5000" : "https://google.com"
export const urls = {
    preview: (identifier) => `${domain}/filters/${identifier}`,
    get: (identifier) => `${domain}/filters/${identifier}/get`
}