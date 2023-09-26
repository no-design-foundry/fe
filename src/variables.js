const domain = process.env.NEXT_PUBLIC_BE
export const urls = {
    preview: (identifier) => `${domain}/filters/${identifier}`,
    get: (identifier) => `${domain}/filters/${identifier}/get`
}